# local-https-server

local-https-server is a CLI tool to provide an easy way to run a local HTTPS server with their valid certifications and port-forward the trafic to another server running locally.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install local-https-server.

```bash
npm install --save-dev @kenystev/local-https-server
```

## Usage

```python
# run the server with default ports and auto-generated certs
local-https-server start

# override the default port to HTTPS server
local-https-server start -p 3005

# override the default forwarding port
local-https-server start -pp 3005

# override the default certs' key to provide some custom key
local-https-server start -k <path/to/file>

# override the default certs key to provide some custom certs
local-https-server start -c <path/to/file>
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
