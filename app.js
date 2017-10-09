import { name } from './config';
import * as models from './models';
import dirWatcher from './dirwatcher';
import Importer from './importer';
import start from './utils/streams';

// dirWatcher.watch('./data', 2000);
// const importer = new Importer();
start();
console.log(`App name: ${name}`);

new models.User;
new models.Product;
