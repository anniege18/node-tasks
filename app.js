import { name } from './config';
import * as models from './models';

console.log(`App name: ${name}`);

new models.User;
new models.Product;
