const express         = require('express');
const bodyParser      = require('body-parser');
const cors            = require('cors');
const routes          = require('./router');
const terminus        = require('@godaddy/terminus');
const http            = require('http');
const PORT = 8081;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/', routes);

// create an instance of connection
const server = http.createServer(app);

const options = {
  // cleanup options
  timeout: 1000,                   // [optional = 1000] number of milliseconds before forcefull exiting
  signal: 'SIGTERM',               // [optional = 'SIGTERM'] what signal to listen for relative to shutdown
}

//starting the instance of the connection
terminus.createTerminus(server, options);

process.on('SIGTERM', (code, signal) => {
  console.log('code', code, 'signal', signal)
    server.close(() => {
    console.log('server termination has been commited...')
    process.exit(0);
  })
});

server.listen(PORT, () => { 
  console.log(`${PORT} is live`)
  console.log(`pid is: ${process.pid}`) 
});