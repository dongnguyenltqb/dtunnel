const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const Ajv = require("ajv").default;
const ajv = new Ajv({
  useDefaults: true,
  coerceTypes: true,
});

const tmp_path = path.join(process.env.HOME, "./tunnel-nodejs");
const configSchema = require("./config.schema");

function getFileStat(file_path) {
  try {
    console.log(`checking config file: ${file_path}`);
    const stat = fs.statSync(file_path);
    if (stat.isFile()) {
      return true;
    }
    throw new Error(`${file_path} is not config file.`);
  } catch (err) {
    console.log(`Can not read file stat ${file_path}: ${err.message}`);
  }
}

function getConfigFile() {
  const config_paths = [
    process.argv[2],
    path.join(process.cwd(), process.argv[2] || ""),
    path.join(process.cwd(), "./config.js"),
  ].filter((x) => !!x);
  console.log(`list config to check:`, config_paths);
  for (let config_path of config_paths) {
    if (getFileStat(config_path)) {
      config_path = path.resolve(config_path);
      console.log(`use config file: ${config_path}`);
      return require(config_path);
    }
  }
  console.log("There is not config found.");
  process.exit(1);
}

function writePrivateKeyToTmp(private_key) {
  let private_key_tmp_file = path.join(
    tmp_path,
    "key" + Math.random().toString().slice(2, 15)
  );
  fs.writeFileSync(private_key_tmp_file, private_key, {
    mode: 0o600,
  });
  return private_key_tmp_file;
}

function buildCommand(server) {
  let { host, user, private_key, targets, port } = server;
  let private_key_tmp_file = writePrivateKeyToTmp(private_key);
  let argv =
    `-Nv -i ${private_key_tmp_file} -o ServerAliveInterval=60 -o ExitOnForwardFailure=yes  -o StrictHostKeyChecking=no -o UserKnownHostsFile=${path.join(
      tmp_path,
      "./" + Math.random().toString().slice(2, 15)
    )} ${targets
      .map(({ forwarding, local_port, remote_port, addr }) =>
        forwarding == "local"
          ? `-L ${local_port}:${addr}:${remote_port}`
          : `-R 0.0.0.0:${remote_port}:${addr}:${local_port}`
      )
      .join(" ")} ${user}@${host} -p ${port}`
      .split(" ")
      .filter((x) => x !== " " && x !== "");
  return {
    id: `[${user}@${host}:${port}]`,
    command: ["ssh", argv],
  };
}

function prepare() {
  console.log("PWD: ", process.cwd());
  fs.mkdirSync(tmp_path, {
    recursive: true,
  });
}

function run() {
  const { command, id } = this;
  this.proc = spawn(command[0], command[1]);
  this.proc.stdout.on("data", (data) => {
    console.log(id, data.toString());
  });
  this.proc.stderr.on("data", (data) => {
    console.log(id, data.toString());
  });
  this.proc.on("error", (err) => {
    console.log(id, err);
  });
  this.proc.on("exit", () => {
    setTimeout(() => {
      this.run(command);
    }, 2000);
  });
}

function Job(build) {
  console.log(build.command);
  this.command = build.command;
  this.id = build.id;
  this.run = run;
  this.kill = function () {
    this.proc.kill();
  };
}

function validateConfig(config) {
  const validate = ajv.compile(configSchema.schema);
  const valid = validate(config);
  if (!valid) {
    console.log("invalid config file found:");
    console.log(validate.errors);
    process.exit(1);
  }
}

async function start() {
  prepare();
  let config = getConfigFile();
  validateConfig(config);
  let builds = config.map((server) => buildCommand(server));
  for (let build of builds) {
    let job = new Job(build);
    job.run();
  }
}

start();
