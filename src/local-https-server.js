const { Command } = require('commander');
const { spawn } = require('node:child_process');

const program = new Command();

program
  .name('local-https-server')
  .description('CLI to run a local HTTPS server with a self-signed certificate')
  .version('0.0.0');

program
  .command('start')
  .description('Start the HTTPS proxy server')
  .option('-p, --port <port>', 'port to listen on', 3001)
  .option('-pp, --proxy-port <port>', 'port to forward trafic to locally', 3000)
  .option(
    '-c, --cert <path>',
    'path to the certificate',
    './.certs/localhost-key.pem'
  )
  .option('-k, --key <path>', 'path to the key', './.certs/localhost.pem')
  .action((options) => {
    console.log('start', options);
    const runServer = spawn('bash', [
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
  .action(() => {
    const runServer = spawn('bash', [__dirname + '/scripts/setup-certs']);

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

program.parse();
