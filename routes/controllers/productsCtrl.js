import { promisify } from 'util';
import { writeFile } from 'fs';
import path from 'path';
import { awaitTo } from '../../helpers';
import products from '../json/products.json';

const writeFileAsync = promisify(writeFile);
const resolveUrl = url => path.resolve(__dirname, url);
const productsFilename = resolveUrl('../json/products.json');

const setProducts = (products) => awaitTo(writeFileAsync(productsFilename, JSON.stringify(products, null, 2)));


export const getProducts = (req, res) => {
    if (!products) {
        res.status(404).json({ error: 'Products not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ products });
};


export const addProduct = async (req, res) => {
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
};


export const getProduct = (req, res) => {
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
};


export const getReviews = (req, res) => {
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
};