import {MyApp} from './app';
import http from 'http';
import util from 'util';

const port: string | undefined = process.env.PORT;
const jwtSecret: string | undefined = process.env.JWT_SECRET;

if (port == undefined) {
  console.error('env not exists: PORT');
  process.exit(1);
}

if (jwtSecret == undefined) {
  console.error('env not exists: JWT_SECRET');
  process.exit(1);
}

const myApp: MyApp = new MyApp(jwtSecret);
const server = http.createServer(myApp.app);

server.listen(port, () => {
  console.log(util.format('server is running on port %d', port));
});

process.on('SIGTERM', () => {
  console.log('sigterm signal received: closing http server');
  server.close(() => {
    console.log('http server closed');
  });
});
