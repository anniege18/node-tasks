import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import { promisify } from 'util';
import awaitTo from '../helpers/awaitTo';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const router = express.Router();

const resolveUrl = url => path.resolve(__dirname, url);

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.use((req, res, next) => {
    console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
    console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
    next();
});

router.get('/products', async (req, res) => {
    const [err, data] = await awaitTo(readFileAsync(resolveUrl('./json/products.json'), 'utf8'));
    if (err) res.status(404).json({ error: 'Products file not found' });

    const products = JSON.parse(data);
    if (!products.length) res.status(404).json({ error: 'Products not found' });
    res.type('json');
    res.status(200).json({ products });
});

router.post('/products', async (req, res) => {
    const filename = resolveUrl('./json/products.json');
    const [err, data] = await awaitTo(readFileAsync(filename, 'utf8'));
    if (err) res.status(404).json({ error: 'Products file not found' });

    const products = JSON.parse(data);
    req.body.id = products.length;
    products.push(req.body);
    const [error] = await awaitTo(writeFileAsync(filename, JSON.stringify(products, null, 2)));
    if (error) res.sendStatus(500);

    res.status(200).json(req.body);
});

router.get('/products/:id([0-9]+)', async (req, res) => {
    const [err, data] = await awaitTo(readFileAsync(resolveUrl('./json/products.json'), 'utf8'));
    if (err) res.status(404).json({ error: 'Products file not found' });

    const products = JSON.parse(data);
    const filteredProducts = products.filter(product => product.id === Number(req.params.id));
    if (!filteredProducts.length) res.status(404).json({ error: 'Product not found' });
    res.type('json');
    res.status(200).json(filteredProducts.pop());
});

router.get('/products/:id([0-9]+)/reviews', async (req, res) => {
    const [err, data] = await awaitTo(readFileAsync(resolveUrl('./json/products.json'), 'utf8'));
    if (err) res.status(404).json({ error: 'Products file not found' });

    const products = JSON.parse(data);
    const filteredProducts = products.filter(product => product.id === Number(req.params.id));

    if (!filteredProducts.length) {
        res.status(404).json({ error: 'Product not found' });
    } else if (!filteredProducts[0]['reviews']) {
        res.status(404).json({ error: 'Product reviews not found' });
    } else {
        res.status(200).send(filteredProducts[0]['reviews']);
    }
});

router.get('/users', async (req, res) => {
    const [err, data] = await awaitTo(readFileAsync(resolveUrl('./json/users.json'), 'utf8'));
    if (err) res.status(404).json({ error: 'Users file not found' });

    const users = JSON.parse(data);
    if (!users.length) res.status(404).send('Users not found');
    res.type('json');
    res.status(200).json({ users });
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;