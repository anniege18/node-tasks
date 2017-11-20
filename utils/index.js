import products from '../models/data/products.json';
import users from '../models/data/users.json';
import models from '../models';

const User = new models.User();
User.loadUsers(users);

const Product = new models.Product();
Product.loadProducts(products);

export {
    User,
    Product
}