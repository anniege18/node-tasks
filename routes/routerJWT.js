import express from 'express';
import bodyParser from 'body-parser';
import { checkToken } from '../helpers';
import {
    getProducts,
    addProduct,
    getProduct,
    getReviews
} from './controllers/productsCtrl';
import getUsers from './controllers/usersCtrl';
import { authorizeJWT } from './controllers/authCtrl';

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

router.get('/products', checkToken, getProducts);
router.post('/products', checkToken, addProduct);
router.get('/products/:id([0-9]+)', checkToken, getProduct);
router.get('/products/:id([0-9]+)/reviews', checkToken, getReviews);
router.get('/users', checkToken, getUsers);
router.post('/auth', authorizeJWT);

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;