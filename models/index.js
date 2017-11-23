import User from './User';
import Product from './Product';
import Cities from './Cities';
import Review from './Review';

const ProductModel = new Product();
const UserModel = new User();
const CitiesModel = new Cities();
const ReviewModel = new Review();

export default {
    User: UserModel,
    Product: ProductModel,
    Cities: CitiesModel,
    Review: ReviewModel,
};
