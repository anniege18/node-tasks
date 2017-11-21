import express from 'express';
import bodyParser from 'body-parser';
import { awaitTo } from '../helpers';
import db from '../models';

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


// get all products
router.get('/products', async (req, res) => {

    const [err, products] = await awaitTo(db['Product'].findAll({raw:true}));

    if (err) {
        res.sendStatus(500);
    }

    if (!products.length) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ products });
});


// add new product
router.post('/products', async (req, res) => {

    const [error, lastProduct] = await awaitTo(db['Product'].findOne({
        order: [
            ['id', 'DESC'],
        ],
        raw: true
    }));

    if (error) {
        res.sendStatus(500);
        return;
    }

    const [err, product] = await awaitTo(db['Product'].create({
        id: (lastProduct ? lastProduct.id + 1 : 0),
        ...req.body
    }));

    if (err) {
        res.sendStatus(500);
        return;
    }

    res.status(200).json({ product });
});


// get product by ID
router.get('/products/:id([0-9]+)', async (req, res) => {
    const [err, product] = await awaitTo(db['Product'].findById(req.params.id));
    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!product) {
        res.status(404).json({ error: `Product with id ${req.params.id} not found` });
        return;
    }

    res.type('json');
    res.status(200).json(product);
});

router.get('/products/:id([0-9]+)/reviews', async (req, res) => {
    const [err, data] = await awaitTo(db['Product'].findAll({
        include: [{ model: db['Review'], as: 'children' }]
    }));

    console.log(err);
    console.log(data);
    // if (err) res.status(404).json({ error: 'Products file not found' });
    //
    // const products = JSON.parse(data);
    // const filteredProducts = products.filter(product => product.id === Number(req.params.id));
    //
    // if (!filteredProducts.length) {
    //     res.status(404).json({ error: 'Product not found' });
    // } else if (!filteredProducts[0]['reviews']) {
    //     res.status(404).json({ error: 'Product reviews not found' });
    // } else {
    //     res.status(200).send(filteredProducts[0]['reviews']);
    // }
});


// get all users
router.get('/users', async (req, res) => {
    const [err, users] = await awaitTo(db['User'].findAll({raw:true}));

    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!users.length) {
        res.status(404).json({ error: 'Users not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ users });
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;