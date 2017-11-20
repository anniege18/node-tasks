import express from 'express';
import bodyParser from 'body-parser';
import { awaitTo } from '../helpers';
import cities from '../models/data/cities.json';
import models from '../models';

const Cities  = new models.Cities();

import { MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, async (err, db) => {
    if (err) throw err;
    try {
        await db.createCollection('city');
        const [error] = await awaitTo(db.collection('city').drop());
        if (error) throw error;
        const [err, res] = await awaitTo(db.collection('city').insertMany(cities));
        if (err) throw err;
        console.info(`Into DB was inserted ${res.insertedCount} docs`);
        db.close();
    } catch(error) {
        console.error('Error: ', error);
    }
});

const router = express.Router();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.get('/cities', (req, res) => {
    MongoClient.connect(url, async (err, db) => {
        const count = await db.collection('city').find({}).count();
        const randomCount = randomIntFromInterval(0, count-1);
        const city = db.collection('city').find({ index: randomCount });
        city.forEach(item => {
            res.json(item);
        });
    });
});

router.get('/city', async (req, res) => {
    const count = await Cities.countCities();
    const randomCount = randomIntFromInterval(0, count-1);
    const city = await Cities.findCity(randomCount);
    city.forEach(item => {
        res.json(item);
    });
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}