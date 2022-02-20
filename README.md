
# dtunnel
Setup tunnel on remote server to forward traffic.
https://www.ssh.com/academy/ssh/tunneling/example
## Build
```
tunnel-nodejs on  master [!?] is 📦 v1.0.0 via  v16.14.0 on ☁️  (ap-southeast-1)
❯ sudo npm i -g pkg

changed 156 packages, and audited 157 packages in 3s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

tunnel-nodejs on  master [!?] is 📦 v1.0.0 via  on ☁️  (ap-southeast-1) took 3s
❯ pkg .
> pkg@5.5.2
> Fetching base Node.js binaries to PKG_CACHE_PATH
  fetched-v16.13.2-macos-x64          [====================] 100%

  fetched-v16.13.2-linux-x64          [====================] 100%

> Warning Cannot resolve 'config_path'
  /Users/dong/Desktop/code/tunnel-nodejs/index.js
  Dynamic require may fail at run time, because the requested file
  is unknown at compilation time and not included into executable.
  Use a string literal as an argument for 'require', or leave it
  as is and specify the resolved file name in 'scripts' option.
prebuild-install WARN install No prebuilt binaries found (target=v16.13.2 runtime=node arch=x64 libc= platform=darwin)
prebuild-install WARN install No prebuilt binaries found (target=v16.13.2 runtime=node arch=x64 libc= platform=linux)

tunnel-nodejs on  master [!?] is 📦 v1.0.0 via  v16.14.0 on ☁️  (ap-southeast-1) took 1m30s
❯ ll
total 184840
-rw-r--r--    1 dong  staff   2.0K Feb 20 20:14 config.js
-rw-r--r--    1 dong  staff   422B Feb 20 20:17 config.js.example
-rwxr-xr-x    1 dong  staff    42M Feb 20 20:24 dtunnel-linux
-rwxr-xr-x    1 dong  staff    47M Feb 20 20:24 dtunnel-macos
-rw-r--r--    1 dong  staff   2.8K Feb 20 20:16 index.js
drwxr-xr-x  112 dong  staff   3.5K Feb 20 16:42 node_modules
-rw-r--r--    1 dong  staff    76K Feb 20 16:42 package-lock.json
-rw-r--r--    1 dong  staff   457B Feb 20 20:22 package.json
drwxr-xr-x    3 dong  staff    96B Feb 20 17:40 ~

tunnel-nodejs on  master [!?] is 📦 v1.0.0 via  v16.14.0 on ☁️  (ap-southeast-1)
❯
```
## Run
```
❯ ./dtunnel-macos ./config.js
```
