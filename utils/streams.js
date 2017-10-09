import fs from "fs";
import path from 'path';
import yargs from 'yargs';
import through2 from 'through2'
import split from 'split';
import request from 'request';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const cssUrl = 'https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css';

const start = () => {

    const argv = yargs
        .usage('npm start -- --action <action> --file <name> --path <path>')
        .option('action', {
            alias: 'a',
            describe: 'choose your action'
        })
        .option('file', {
            alias: 'f',
            describe: 'provide a path to file'
        })
        .option('path', {
            alias: 'p',
            describe: 'provide a path to css files'
        })
        .demandOption(['action'], 'Please provide at least action param')
        .help(true, 'You should use options like action and file or path to run program correctly')
        .argv;

    if (argv.action) {
        let pathToFile = null;
        if (argv.file) {
            pathToFile = path.resolve(__dirname, argv.file);
        }

        switch(argv.action) {
            case 'io':
                inputOutput(pathToFile);
                break;
            case 'transform':
                transform();
                break;
            case 'transform-file':
                transformFile(pathToFile, false);
                break;
            case 'transform-file-and-save':
                transformFile(pathToFile, true);
                break;
            case 'bundle-css':
                cssBundler(argv.path);
                break;
            default:
                console.warn('No command found');
                break;
        }
    }
};

// output any file to process.stdout
// EXAMPLE: npm start -- -a io -f MOCK_DATA.csv
const inputOutput = (filePath) => {
    fs.createReadStream(filePath)
        .pipe(process.stdout);
};

// transform input from stdin to uppercase and output to stdout
// EXAMPLE: npm start -- -a transform
const transform = () => {
    console.log('Please, input any string....');
    process.stdin
        .pipe(through2.obj(function (chunk, enc, next) {
            this.push(chunk.toString().toUpperCase());
            next();
        }))
        .pipe(process.stdout);
};

// transform input .csv file to json
// and output depending on toFile param stdin/<fileName>.json
// EXAMPLE: npm start -- -a transform-file(-and-save) -f MOCK_DATA.csv or
const transformFile = (filePath, toFile) => {
    let lineNumber = 0;
    let fields = null;
    let writeStream;

    if (toFile) {
        writeStream = fs.createWriteStream(filePath.replace('.csv', '.json'));
    }

    fs.createReadStream(filePath)
        .pipe(split())
        .pipe(through2.obj(function (chunk, enc, next) {
            const values = chunk.split(/(?!\B"[^"]*),(?![^"]*"\B)/);

            if (lineNumber === 0) {
                fields = values;
                this.push('[');
                next();
            } else {
                if (!chunk) { this.push(']'); return; }
                const obj = fields.reduce((acc, field, i) =>
                    Object.assign(acc, { [field]: values[i]}), {});
                const str = JSON.stringify(obj, null, 2);
                this.push(lineNumber === 1 ? str : ',\n'.concat(str));
                next();
            }
            lineNumber++;
        }))
        .pipe(toFile ? writeStream : process.stdout);
};

// read all css files and bundle them to one, adding css data from url in the end
const cssBundler = async (pathToFile) => {
    const folderPath = path.resolve(__dirname, '..', pathToFile);

    const stats = await stat(folderPath);
    if (stats.isDirectory()) {
        const files = await readdir(folderPath);
        const writeStream = fs.createWriteStream(`${folderPath}/bundle.css`, { flags: 'w' });

        files.forEach(async (file) => {
            const path = `${folderPath}/${file}`;
            const fileStats = await stat(path);

            if (fileStats.isFile() && !!~file.indexOf('.css')) {
                fs.createReadStream(path)
                    .pipe(writeStream);
            }
        });

        const writeStream2 = fs.createWriteStream(`${folderPath}/bundle.css`, { flags: 'a' });
        request(cssUrl)
            .pipe(writeStream2);

        writeStream2.on('finish', () => {
            console.log('wrote all data to file');
        });
    }
};

export default start;