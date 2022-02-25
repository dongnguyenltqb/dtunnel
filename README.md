
# dtunnel
Setup tunnel on remote server to forward traffic.
https://www.ssh.com/academy/ssh/tunneling/example
## Build
```
tunnel-nodejs on  master
❯ sudo npm i -g pkg

tunnel-nodejs on  master
❯ pkg .
> pkg@5.5.2
> Fetching base Node.js binaries to PKG_CACHE_PATH
  fetched-v16.13.2-macos-x64          [====================] 100%

  fetched-v16.13.2-linux-x64          [====================] 100%

tunnel-nodejs on  master 
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

tunnel-nodejs on  master
❯
```
## Run
Prepare config file (the config file is JS file). See config.js.example. Then run command below.
```
❯ ./dtunnel-macos ./config.js
```
