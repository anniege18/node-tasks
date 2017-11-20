import products from '../models/data/products.json';
import users from '../models/data/users.json';
import models from '../models';


models.User.loadUsers(users);

models.Product.loadProducts(products);

