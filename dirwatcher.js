import fs from 'fs';
import { promisify } from 'util';
import EventEmitter from 'events';

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

class DirWatcher extends EventEmitter {
  constructor() {
    super();
    this.folderFiles = {};
  }

  watch(folderPath, delay) {
    setInterval(async() => {
      try {
        const stats = await stat(folderPath);

        if (stats.isDirectory()) {
          const files = await readdir(folderPath);

          files.forEach(async (file) => {
			const path = `${folderPath}/${file}`;
            const fileStats = await stat(path);
            const lastModified = fileStats.mtimeMs;

            if (!this.folderFiles[file]) {
				this.folderFiles[file] = lastModified;
				this.emit('dirwatcher:changed', path, file);
				console.log(`${file} was added.`);
            } else if (this.folderFiles[file] !== lastModified) {
				this.folderFiles[file] = lastModified;
  				this.emit('dirwatcher:changed', path, file);
				console.log(`${file} was modified.`);
            }
          });
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }, delay);
  }
}

export default DirWatcher;