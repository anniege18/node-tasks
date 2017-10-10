import fs from 'fs';
import readline from 'readline';
import { promisify } from 'util';

class Importer {
    constructor(dirwatcher) {
        this.keys = null;
        this.dirwatcher = dirwatcher;
    }

    import() {
        this.dirwatcher.on('dirwatcher:changed', (path, file) => {
            let lineNumber = 0;
            const filename = file.replace(/\.csv$/, '.json');

            const readStream = fs.createReadStream(path);
            const writeStream = fs.createWriteStream(`${__dirname}/json/${filename}`);
            writeStream.write('[');

            const rl = readline.createInterface({
                input: readStream,
            });

            rl.on('line', (line) => {
                if (lineNumber === 0) {
                    this.keys = line.split(',');
                } else {
                    const values = line.split(/(?!\B"[^"]*),(?![^"]*"\B)/);

                    //parse string to obj and stringify
                    const newLine = JSON.stringify(this.keys.reduce((acc, key, i) =>
                      Object.assign(acc, { [key]: values[i] }), {}), null, 2);

                    // add new line ahead every obj besides first
                    lineNumber !== 1 ? writeStream.write(',\n'.concat(newLine)) : writeStream.write(newLine);
                }
                lineNumber++;
            });

            rl.on('close', () => {
                writeStream.write(']');
                lineNumber = 0;
                writeStream.end();
                console.log(`${filename} was imported.`);
            });
        })
    }

    importSync() {
        this.dirwatcher.on('dirwatcher:changed', (path, file) => {
            const filename = file.replace(/\.csv$/, '.json');
            const data = fs.readFileSync(path, { encoding: 'utf8' });
            const strArray = data.split('\n');
            const keys = strArray[0].split(',');

            const transformedArray = strArray
              .map(str =>
                str.split(/(?!\B"[^"]*),(?![^"]*"\B)/)
                  .reduce((acc, val, i) =>
                    Object.assign(acc, { [keys[i]]: val }), {}));
            fs.writeFileSync(`${__dirname}/json/${filename}`, JSON.stringify(transformedArray, null, 2));
            console.log(`File transformed to json format!`);
        });
    }
}

export default Importer;