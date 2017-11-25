import express from 'express';
import { MongoClient } from 'mongodb';
import { awaitTo } from '../helpers';
import models from '../models';
import cities from '../models/data/cities.json';
const router = express.Router();
const Cities  = models.Cities;

const randomIntFromInterval = (min, max) => Math.floor(Math.random()*( max - min + 1) + min);

const url = 'mongodb://localhost:27017/test';

// insert cities into DB
MongoClient.connect(url, async (er, db) => {
    if (er) {
        console.error(er);
        return;
    }

    await db.createCollection('city');

    const [error] = await awaitTo(db.collection('city').drop());
    if (error) {
        console.error(error);
        return;
    }
    const [err, res] = await awaitTo(db.collection('city').insertMany(cities));
    if (err) {
        console.error(err);
        return;
    }

    console.info(`Cities was successfully added in qty ${res.insertedCount}`);
    db.close();
});


// random city with mongo native implementation
//  localhost:8080/db/cities-mongo
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
//  localhost:8080/db/cities-mongoose
router.get('/cities-mongoose', async (req, res) => {
    const [error, count] = await awaitTo(Cities.count());

    if (error) {
        res.status(404).send('Cities not found');
        return;
    }
    const randomCount = randomIntFromInterval(0, count-1);
    const [err, city] = await awaitTo(Cities.find(randomCount));

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
