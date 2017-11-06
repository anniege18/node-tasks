import http from 'http';
import path from 'path';
import fs from 'fs';
import { Transform } from 'stream';

const port1 = 3001;
const port2 = 3002;

const url = path.resolve(__dirname, './views/index.html');


// readFileSync
http.createServer((req, res) => {

    let file = null;
    try {
        file = fs.readFileSync(url, 'utf8');
    } catch (err) {
        res.writeHead(404);
        res.end('File not found!');
    }

    if (file) {
        const content = file.replace(/{message}/g, 'Hello world!!!');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content);
    }
}).listen(port1, () => { console.log(`Listening port ${port1}...`); });


// createReadStream
const transformTemplate = new Transform({
    transform(chunk, encoding, done) {
        let templateStr = chunk.toString();
        const str = templateStr.replace(/{message}/g, 'Hello world!!!');
        this.push(str);
        done();
    }
});

http.createServer((req, res) => {
    fs.createReadStream(url, 'utf8')
      .on('error', () => {
          res.writeHead(404);
          res.end('File not found');
        })
      .on('end', () => {
          res.writeHead(200, {'Content-Type': 'text/html'});
      })
      .pipe(transformTemplate)
      .pipe(res);
})
  .listen(port2, () => { console.log(`Listening port ${port2}...`); });