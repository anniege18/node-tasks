import { MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017/test';

const promise = new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            reject(err);
        } else {
            resolve(db);
        }
    });
});

export default promise;