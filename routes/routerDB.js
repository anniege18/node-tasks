import express from 'express';
import { awaitTo } from '../helpers';
import models from '../models';
const Cities  = models.Cities;

const randomIntFromInterval = (min, max) => Math.floor(Math.random()*( max - min + 1) + min);

const router = express.Router();

import { MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017/test';

// insert cities into DB from json
MongoClient.connect(url, async (err, db) => {
    if (err) throw err;
    try {
        await db.createCollection('city');
        const [error] = await awaitTo(db.collection('city').drop());
        if (error) throw error;
        const [err, res] = await awaitTo(db.collection('city').insertMany(cities));
        if (err) throw err;
        console.info(`Into database was inserted ${res.insertedCount} docs`);
        db.close();
    } catch(error) {
        console.error('Error: ', error);
    }
});

// random city with mongo native implementation
router.get('/cities-mongo', async (req, res) => {
    const [err, db] = await awaitTo(MongoClient.connect(url));

    if (err) {
        res.sendStatus(500);
        return;
    }
    const [error, count] = await awaitTo(db.collection('city').find({}).count());

    if (error) {
        res.status(404).send('Cities not found');
        return;
    }
    const randomCount = randomIntFromInterval(0, count-1);
    const [er, city] = await awaitTo(db.collection('city').findOne({ index: randomCount }));

    if (er) {
        res.status(404).send(`Cities with index ${randomCount} not found`);
        return;
    }
    res.json(city);
});

// random city with mongoose native implementation
router.get('/cities-mongoose', async (req, res) => {
    const [error, count] = await awaitTo(Cities.countCities());

    if (error) {
        res.status(404).send('Cities not found');
        return;
    }
    const randomCount = randomIntFromInterval(0, count-1);
    const [err, city] = await awaitTo(Cities.findCity(randomCount));

    if (err) {
        res.status(404).send(`Cities with index ${randomCount} not found`);
        return;
    }

    res.json(city);
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

export default router;
