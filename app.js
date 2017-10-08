import { name } from './config';
import * as models from './models';
import dirWatcher from './dirwatcher';
import Importer from './importer';

dirWatcher.watch('./data', 2000);
const importer = new Importer();

console.log(`App name: ${name}`);

new models.User;
new models.Product;
