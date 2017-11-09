import express from 'express';
import { writeFile } from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { awaitTo } from '../helpers';
import users from './json/users.json';
import products from './json/products.json';

const currentUsers = [{
        id: 0,
        login: 'ivan',
        password: 'abc',
        email: 'ivan@gmail.com',
        isActive: true,
    },
    {
        id: 1,
        login: 'helen',
        password: '222',
        email: 'helen@xyz.com',
        isActive: true,
    }];

const checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'qwertyuzxcvbn', (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                next();
            }
        });
    } else {
        res.status(403).send({ success: false, message: 'No token provided.' });
    }
};

const writeFileAsync = promisify(writeFile);

const resolveUrl = url => path.resolve(__dirname, url);
const productsFilename = resolveUrl('./json/products.json');

const router = express.Router();

const setProducts = (products) => awaitTo(writeFileAsync(productsFilename, JSON.stringify(products, null, 2)));

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', checkToken, (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ products });
});

router.post('/products', checkToken, async (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    req.body.id = products.length;
    products.push(req.body);
    const [error] = await setProducts(products);
    if (error) {
        res.sendStatus(500);
        return;
    }

    res.status(200).json(req.body);
});

router.get('/products/:id([0-9]+)', checkToken, (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    const filteredProduct = products.find(product => product.id === Number(req.params.id));
    if (!filteredProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }
    res.type('json');
    res.status(200).json(filteredProduct);
});

router.get('/products/:id([0-9]+)/reviews', checkToken, (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    const filteredProduct = products.find(product => product.id === Number(req.params.id));

    if (!filteredProduct) {
        res.status(404).json({ error: 'Product not found' });
    } else if (!filteredProduct['reviews']) {
        res.status(404).json({ error: 'Product reviews not found' });
    } else {
        res.status(200).send(filteredProduct['reviews']);
    }
});

router.get('/users', checkToken, (req, res) => {
    if (!users) {
        res.status(404).json({ error: 'Users not found' });
    }

    res.type('json');
    res.status(200).json({ users });
});

router.post('/auth', (req, res) => {
    let user = currentUsers.find(({ login }) => req.body.login === login);
    let resMsg = {
        code: '',
        message: '',
        data: null
    };
    if (!user || req.body.password !== user.password) {
        resMsg.code = 404;
        resMsg.message = 'Not found';
        resMsg.data = 'Invalid login/password';
        res.status(404).json(resMsg);
    } else {
        let payload = { "sub": user.id, "isActive": user.isActive };
        let token = jwt.sign(payload, 'qwertyuzxcvbn', { expiresIn: 100 });
        resMsg.code = 200;
        resMsg.message = 'OK';
        resMsg.data = {
            user: {
                email: user.email,
                username: user.login,
            },
        };
        resMsg.token = token;
        res.status(200).json(resMsg);
    }
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;