import User from './User';
import Product from './Product';
import Cities from './Cities';

const ProductModel = new Product();
const UserModel = new User();
const CitiesModel = new Cities();

export default {
    User: UserModel,
    Product: ProductModel,
    Cities: CitiesModel
};
