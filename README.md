# local-https-server

local-https-server is a CLI tool to provide an easy way to run a local HTTPS server with their valid certifications and port-forward the trafic to another server running locally.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install local-https-server.

```bash
npm install --save-dev @kenystev/local-https-server
```

## Usage

```bash
# run the server with default ports and auto-generated certs
local-https-server start

# override the default port to HTTPS server
local-https-server start -p 3005

# override the default forwarding port
local-https-server start -pp 3005

# override the default certs' key to provide some custom key
local-https-server start -k "<path/to/file>"

# override the default certs key to provide some custom certs
local-https-server start -c "<path/to/file>"

# share the server on the local network
# the certificate is generated for localhost and this IP
local-https-server start -i 192.168.1.42
```

Other devices on the same network can open `https://192.168.1.42:3001` (use the IP you passed and the HTTPS port). Install this machine's mkcert root CA on those devices so the certificate is trusted. The CA file is `rootCA.pem` inside the directory printed by `mkcert -CAROOT`.

To generate that certificate without starting the server:

```bash
local-https-server setup-certs -i 192.168.1.42
```

**Note** Make sure to add the `.certs` directory to your `.gitignore` file in order to not expose your cerdentials

## Utility commands

by default after installation, local-https-server automatically runs the pre-required commands to install deps and setup the certs, but if anything happens or accidentally you have deleted the `.certs` directory created after installation then you can run independently the right commands:

```bash
# Install needed dependencies to generate the certifications
local-https-server install-deps

# Generate the valid certifications to run HTTPS server and put them in .certs directory
local-https-server setup-certs

# Generate certifications that also include a LAN IP
local-https-server setup-certs -i 192.168.1.42
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
