import fs from 'fs';
import readline from 'readline';
import dirwatcher from './dirwatcher';
import { promisify } from 'util';

class Importer {
    constructor() {
		this.keys = null;

        dirwatcher.on('dirwatcher:changed', (path, file) => {
			let lineNumber = 0;
            const filename = file.replace(/\.csv$/, '.json');

			let readStream = fs.createReadStream(path);
			let writeStream = fs.createWriteStream(`${__dirname}/json/${filename}`);
			writeStream.write('[');

			let rl = readline.createInterface({
				input: readStream,
			});

			rl.on('line', (line) => {
				if (lineNumber === 0) {
				    this.keys = line.split(',');
                } else {
				    const values = line.split(',');

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
}

export default Importer;