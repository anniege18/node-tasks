import products from '../models/data/products.json';
import users from '../models/data/users.json';
import reviews from '../models/data/reviews.json';
import models from '../models';


models.User.loadUsers(users);
models.Product.loadProducts(products);
models.Review.loadReviews(reviews);

