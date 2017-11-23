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
    if (err) res.status(404).json({ error: 'Products file not found' });

    if (!products.length) res.status(404).json({ error: 'Products not found' });
    res.type('json');
    res.status(200).json({ products });
});

router.post('/products', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel.findOne().sort('-index'));
    if (err) {
        res.sendStatus(500);
        return;
    }

    if (!product) {
        res.status(404).json({error: 'Products not found'});
    }

    const newProduct = new ProductModel({
        index: product.index + 1,
        name: req.body.name,
        brand: req.body.brand,
        company: req.body.company,
        price: req.body.price,
        isbn: req.body.isbn
    });

    const [error, prod] = await awaitTo(newProduct.save());
    if (error) res.sendStatus(500);

    res.status(200).json(prod);
});

router.get('/products/:id([0-9]+)', async (req, res) => {
    const [err, product] = await awaitTo(ProductModel.findOne({ index: req.params.id }));
    if (err) res.status(404).json({ error: 'Products file not found' });

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
    const [err, product] = await awaitTo(ProductModel.findOne({ index: req.params.id }).populate('reviews'));

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

    if (!city) {
        res.status(404).json({error: 'Cities not found'});
    }

    const newCity = new CityModel({
        index: city.index + 1,
        name: req.body.name,
        country: req.body.country,
        capital: req.body.capital,
        location: { lat: req.body.lat, long: req.body.long }
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
    const [err, city] = await awaitTo(CityModel.findOneAndUpdate(
      {
          index: req.params.id
      },
      { ...req.body },
      {
          new: true,
          upsert: true
      }));

    if (err) {
        res.sendStatus(500);
        return;
    }

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