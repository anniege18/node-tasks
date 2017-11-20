import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
// import { promisify } from 'util';
import { awaitTo } from '../helpers';
import { User, Product } from '../utils';


const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

// router.use((req, res, next) => {
//     console.info('Cookies:', JSON.stringify(req.parsedCookies, null, 4));
//     console.info('Query params:', JSON.stringify(req.parsedQuery, null, 4));
//     next();
// });

// const Product = new models.Product();

const ProductModel = Product.getModel();

router.get('/products', async (req, res) => {

    // const [err, products] = await awaitTo(ProductModel.find({}));
    // if (err) res.status(404).json({ error: 'Products file not found' });
    //
    // if (!products.length) res.status(404).json({ error: 'Products not found' });
    // res.type('json');
    // res.status(200).json({ products });
});

router.post('/products', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel.findOne().sort('-index'));
    console.log(product);
    if (err) res.status(404).json({ error: 'Products file not found' });


    // if (error) res.sendStatus(500);
    //
    // res.status(200).json(req.body);
});

// router.get('/products/:id([0-9]+)', async (req, res) => {
//     const [err, data] = await getProducts();
//     if (err) res.status(404).json({ error: 'Products file not found' });
//
//     const products = JSON.parse(data);
//     const filteredProducts = products.filter(product => product.id === Number(req.params.id));
//     if (!filteredProducts.length) res.status(404).json({ error: 'Product not found' });
//     res.type('json');
//     res.status(200).json(filteredProducts.pop());
// });
//
// router.get('/products/:id([0-9]+)/reviews', async (req, res) => {
//     const [err, data] = await getProducts();
//     if (err) res.status(404).json({ error: 'Products file not found' });
//
//     const products = JSON.parse(data);
//     const filteredProducts = products.filter(product => product.id === Number(req.params.id));
//
//     if (!filteredProducts.length) {
//         res.status(404).json({ error: 'Product not found' });
//     } else if (!filteredProducts[0]['reviews']) {
//         res.status(404).json({ error: 'Product reviews not found' });
//     } else {
//         res.status(200).send(filteredProducts[0]['reviews']);
//     }
// });
//
// router.get('/users', async (req, res) => {
//     const [err, data] = await getUsers();
//     if (err) res.status(404).json({ error: 'Users file not found' });
//
//     const users = JSON.parse(data);
//     if (!users.length) res.status(404).send('Users not found');
//     res.type('json');
//     res.status(200).json({ users });
// });
//
// router.get('*', (req, res) => {
//     res.sendStatus(404);
// });

export default router;