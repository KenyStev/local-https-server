const { Command } = require('commander');
const { spawn } = require('node:child_process');
const { isIP } = require('node:net');

const DEFAULT_CERT_PATH = './.certs/localhost-key.pem';
const DEFAULT_KEY_PATH = './.certs/localhost.pem';

const program = new Command();

function assertIp(ip) {
  if (isIP(ip) === 0) {
    console.error(`Error: Invalid IP address: ${ip}`);
    process.exit(1);
  }
}

function formatHost(ip) {
  return isIP(ip) === 6 ? `[${ip}]` : ip;
}

function spawnScript(args, { onClose } = {}) {
  const child = spawn('bash', args);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  child.on('close', (code) => {
    if (onClose) {
      onClose(code);
      return;
    }
    console.log(`child process exited with code ${code}`);
  });
  child.on('error', (err) => {
    console.error(err);
    if (onClose) process.exit(1);
  });

  return child;
}

function usesDefaultCerts(options) {
  return (
    options.cert === DEFAULT_CERT_PATH && options.key === DEFAULT_KEY_PATH
  );
}

program
  .name('local-https-server')
  .description('CLI to run a local HTTPS server with a self-signed certificate')
  .version('0.0.0');

program
  .command('start')
  .description('Start the HTTPS proxy server')
  .option('-p, --port <port>', 'port to listen on', 3001)
  .option('-pp, --proxy-port <port>', 'port to forward trafic to locally', 3000)
  .option('-c, --cert <path>', 'path to the certificate', DEFAULT_CERT_PATH)
  .option('-k, --key <path>', 'path to the key', DEFAULT_KEY_PATH)
  .option(
    '-i, --ip <ip>',
    'LAN IP to include in the certificate alongside localhost'
  )
  .action((options) => {
    console.log('start', options);
    if (options.ip) assertIp(options.ip);

    const startServer = () => {
      if (options.ip) {
        const shareHost = formatHost(options.ip);
        console.log(`https://localhost:${options.port}`);
        console.log(`https://${shareHost}:${options.port}`);
      }

      spawnScript([
        __dirname + '/scripts/run-https-server',
        '-p',
        options.port,
        '-pp',
        options.proxyPort,
        '-c',
        options.cert,
        '-k',
        options.key,
        ...(options.runAppCommand ? ['-rac', options.runAppCommand] : []),
      ]);
    };

    if (!options.ip) {
      startServer();
      return;
    }

    if (!usesDefaultCerts(options)) {
      console.error(
        `Custom certificate paths are in use. Add ${options.ip} as a certificate name so clients trust https://${formatHost(options.ip)}:${options.port}`
      );
      startServer();
      return;
    }

    console.log(
      `Including ${options.ip} in the certificate alongside localhost`
    );
    spawnScript([__dirname + '/scripts/setup-certs', '-i', options.ip], {
      onClose(code) {
        if (code !== 0) {
          console.error(
            `Error: certificate setup failed${code == null ? '' : ` (exit ${code})`}`
          );
          process.exit(code == null ? 1 : code);
        }
        startServer();
      },
    });
  });

program
  .command('install-deps')
  .description('Install dependencies')
  .action(() => {
    const runServer = spawn('bash', [__dirname + '/scripts/install-deps']);

    runServer.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    runServer.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    runServer.on('error', (err) => {
      console.error(err);
    });
  });

program
  .command('setup-certs')
  .description('Setup the HTTPS proxy server credentials')
  .option(
    '-i, --ip <ip>',
    'LAN IP to include in the certificate alongside localhost'
  )
  .action((options) => {
    if (options.ip) assertIp(options.ip);

    const args = [__dirname + '/scripts/setup-certs'];
    if (options.ip) args.push('-i', options.ip);
    spawnScript(args);
  });

program.parse();
