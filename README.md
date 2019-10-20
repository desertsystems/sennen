# sennen

**instructions**


**download and install**

Download and install instruction below.

Prerequirements:
* git
* npm (instruction at bottom)
* node


```console
> git clone https://github.com/desertsystems/sennen.git
> cd sennen
> npm install
> node app.js
```


**run**

```console
> node app.js
```


**unit test**

```console
> (start test server)
> ./node_modules/.bin/mocha test.js
```


**start local server app**

Incase sunrise-sunset.org is blocking API access.

To check if https://api.sunrise-sunset.org/json is refusing connection...

```console
> curl -v https://api.sunrise-sunset.org/json --data {"lat":"36.7201600","lng":"-4.4203400","date":"today"}
```

if output is similar to:
* connect to 45.33.59.78 port 443 failed: Connection refused
* Failed to connect to api.sunrise-sunset.org port 443: Connection refused
* Closing connection 0

then use local server, instructions below

```console
open new terminal...
> cd sennen
> node server.js

open new terminal...
> cd sennen
> node local.js
```



# install latest npm for mint 12+

1. Download script: https://deb.nodesource.com/setup_12.x >> ~/dev/node
2. Add new line in script: 
    replace:
        `check_alt "Linux Mint"    "tessa"    "Ubuntu" "bionic"`
    with:
        `check_alt "Linux Mint"    "tessa"    "Ubuntu" "bionic"`
        `check_alt "Linux Mint"    "tina"    "Ubuntu" "bionic"`
3. Follow instructions below:

```console
> sudo apt update
> chmod +x setup_12.x
> sudo ./setup_12.x
> sudo apt install gcc g++ make
> sudo apt install -y build-essential
> sudo apt install -y nodejs
> npm -v
```