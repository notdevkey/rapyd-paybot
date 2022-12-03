/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';

import routes from './routes';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to rapyd-wrapper!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);

  routes(app);
});
server.on('error', console.error);
