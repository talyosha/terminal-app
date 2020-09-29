const server = require('http').createServer();
const endOfLine = require('os').EOL;
const io = require('socket.io')(server, {});
const Client = require('ssh2');
const consts = require('./constants');

io.on('connection', (socket) => {
  let conn;

  socket.on('join', async ({ host, port, user, password }) => {
    conn = new Client();
    console.log('socket is joined', socket.id, host, port, user, password);

    try {
      conn.on('error', () => {
        socket.emit('authError');

        conn.end();
      });
      conn.on('ready', () => {
        socket.emit('ready');
      });
      conn.connect({
        host,
        port,
        username: user,
        password,
        passphrase: password,
        keepaliveInterval: 0,
        readyTimeout: 4500,
      });
    } catch (e) {
      console.log('ERROR ON CONNECT', e);
    }
  });

  socket.on('command', ({ path, message, id }) => {
    const comand = `cd ${path} ; ${message} && pwd && echo ${consts.PATH_RESPONSE_LABEL}`;

    conn.exec(comand, (err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
        })
        .on('error', (data, ...rest) => {
          console.log(`ERROR: ${data}`, rest);
        })
        .on('data', (data) => {
          const sshResponse = data.toString('utf8');

          if (data.includes(consts.PATH_RESPONSE_LABEL)) {
            const pathParse = sshResponse.split(endOfLine)[0];
            const res = { path: pathParse, id };

            return socket.emit('path', res);
          }

          const res = { result: sshResponse, id };

          socket.emit('response', res);
        })
        .stderr.on('data', (data) => {
          const error = data.toString('utf8');

          socket.emit('errorResponse', { error, id });
        });
    });
  });
});

server.listen(3017);
