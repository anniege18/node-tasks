import express from 'express';
import bodyParser from 'body-parser';
import { awaitTo } from '../helpers';
import models from '../models';

const router = express.Router();
router.use(bodyParser.json());

const ProductModel = models.Product.getModel();
const UserModel = models.User.getModel();
const CityModel = models.Cities.getModel();

router.get('/products', async (req, res) => {
    const [err, products] = await awaitTo(ProductModel.find());
    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!products.length) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ products });
});

router.post('/products', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel.findOne().sort('-index'));
    if (err) {
        res.sendStatus(500);
        return;
    }

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.sendStatus(400);
        return;
    }

    const { name, brand, company, price, isbn } = req.body;

    const newProduct = new ProductModel({
        index: product ? product.index + 1 : 1,
        name,
        brand,
        company,
        price,
        isbn
    });

    const [error, prod] = await awaitTo(newProduct.save());
    if (error) {
        res.sendStatus(500);
        return;
    }

    res.type('json');
    res.status(200).json(prod);
});

router.get('/products/:id([0-9]+)', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel.findOne({ index: req.params.id }));
    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }

    res.type('json');
    res.status(200).json(product);
});

router.delete('/products/:id([0-9]+)', async (req, res) => {
    const [err] = await awaitTo(ProductModel.remove({ index: req.params.id }));

    if (err) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

router.get('/products/:id([0-9]+)/reviews', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel
      .findOne({ index: req.params.id })
      .populate('reviews'));

    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
    }

    if (!product.reviews.length) {
        res.status(404).json({error: 'Product reviews not found'});
        return;
    }

    res.type('json');
    res.status(200).json(product.reviews);
});

router.get('/users', async (req, res) => {
    const [err, users] = await awaitTo(UserModel.find({}));

    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!users.length) {
        res.status(404).json({error: 'Users not found'});
        return;
    }

    res.type('json');
    res.status(200).json({ users });
});

router.delete('/users/:id([0-9]+)', async (req, res) => {
    const [err] = await awaitTo(UserModel.remove({ index: req.params.id }));

    if (err) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});


// Cities
router.get('/cities', async (req, res) => {
    const [err, cities] = await awaitTo(CityModel.find({}));

    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!cities.length) {
        res.status(404).json({error: 'Cities not found'});
        return;
    }

    res.type('json');
    res.status(200).json({ cities });
});

router.post('/cities', async (req, res) => {
    const [err, city] = await awaitTo(CityModel.findOne().sort('-index'));

    if (err) {
        res.sendStatus(500);
        return;
    }

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.sendStatus(400);
        return;
    }

    const { name, country, capital, lat, long } = req.body;

    const newCity = new CityModel({
        index: city ? city.index + 1 : 1,
        name,
        country,
        capital,
        location: { lat, long }
    });

    const [error, cityCreated] = await awaitTo(newCity.save());

    if (error) {
        res.sendStatus(500);
        return;
    }

    res.type('json');
    res.status(200).json(cityCreated);
});

router.put('/cities/:id([0-9]+)', async (req, res) => {
    const { name, country, capital, lat, long } = req.body;
    const [err, city] = await awaitTo(CityModel.findOneAndUpdate(
      {
          index: req.params.id
      },
      { name, country, capital, location: { lat, long } },
      {
          new: true,
          upsert: true
      }));

    if (err) {
        res.sendStatus(500);
        return;
    }

    res.type('json');
    res.status(200).json(city);
});

router.delete('/cities/:id([0-9]+)', async (req, res) => {
    const [err] = await awaitTo(CityModel.remove({ index: req.params.id }));

    if (err) {
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;