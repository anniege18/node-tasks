import http from 'http';
import path from 'path';
import fs from 'fs';
import { Transform } from 'stream';

const port1 = 3001;
const port2 = 3002;

const url = path.resolve(__dirname, './views/index.html');


// readFileSync
http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');

    let file = null;
    try {
        file = fs.readFileSync(url, 'utf8');
    } catch (err) {
        res.statusCode = 404;
        res.end('File not found!');
    }

    if (file) {
        const content = file.replace('{message}', 'Hello world!!!');
        res.statusCode = 200;
        res.end(content);
    }
}).listen(port1, () => { console.log(`Listening port ${port1}...`); });


// createReadStream
const transformTemplate = new Transform({
    transform(chunk, encoding, done) {
        let templateStr = chunk.toString();
        const str = templateStr.replace('{message}', 'Hello world!!!');
        this.push(str);
        done();
    }
});

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream(url, 'utf8')
      .on('error', () => {
            res.statusCode = 404;
            res.end('File not found');
        })
      .pipe(transformTemplate)
      .pipe(res);
})
  .listen(port2, () => { console.log(`Listening port ${port2}...`); });