const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const tmp_path = path.join(process.env.HOME, "./tunnel-nodejs");

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
  return ["ssh", argv];
}

function prepare() {
  console.log("PWD: ", process.cwd());
  fs.mkdirSync(tmp_path, {
    recursive: true,
  });
}

function run() {
  console.log("argv", this.command[1]);
  this.proc = spawn(this.command[0], this.command[1]);
  this.proc.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  this.proc.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  this.proc.on("error", (err) => {
    console.log(err);
  });
  this.proc.on("exit", () => {
    setTimeout(() => {
      this.run(this.command);
    }, 2000);
  });
}

function Job(command) {
  this.command = command;
  this.run = run;
  this.kill = function () {
    this.proc.kill();
  };
}

async function start() {
  prepare();
  let config = getConfigFile();
  if (!Array.isArray(config)) {
    console.log("invalid config file");
    process.exit(1);
  }
  let commands = config.map((server) => buildCommand(server));
  for (let command of commands) {
    let job = new Job(command);
    job.run();
  }
}

start();
