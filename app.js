import { name } from './config';
import * as models from './models';
// import DirWatcher from './dirwatcher';
// import Importer from './importer';
import Streams from './utils/streams';

// const dirWatcher = new DirWatcher();
// dirWatcher.watch('./data', 2000);
// const importer = new Importer(dirWatcher);
// importer.import();
// importer.importSync();
new Streams().runUtil();

console.log(`App name: ${name}`);

new models.User;
new models.Product;
