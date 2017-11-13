import express from 'express';
import bodyParser from 'body-parser';
import {
    getProducts,
    addProduct,
    getProduct,
    getReviews
} from './controllers/productsCtrl';
import getUsers from './controllers/usersCtrl';

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', getProducts);
router.post('/products', addProduct);
router.get('/products/:id([0-9]+)', getProduct);
router.get('/products/:id([0-9]+)/reviews', getReviews);
router.get('/users', getUsers);

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;