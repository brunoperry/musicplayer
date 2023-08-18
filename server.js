import https from 'https';
import express from 'express';
import { config } from './config.js';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

let isDEV = true;
const PORT = config.PORT;
const PORT_DEV = 3001;
const INDEX = __dirname + '/public/index.html';
const INDEX_DEV = __dirname + '/public/index_dev.html';

app.use(express.static('public'));

app.get('/', (req, res) => {
  isDEV ? res.sendFile(INDEX_DEV) : res.sendFile(INDEX);
});

if (isDEV) {
  app.listen(PORT_DEV, async () => {
    console.log(`DEV Server listening at port ${PORT_DEV}`);
  });
} else {
  https.createServer(app).listen(PORT, async () => {
    console.log(`DEV Server listening at port ${PORT}`);
  });
}
