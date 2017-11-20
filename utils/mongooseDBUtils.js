import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import '../models/City';

const City = mongoose.model('City');

export function setUpConnection() {
    mongoose.connect('mongodb://localhost:27017/cities', { useMongoClient: true });
}

export function findCity(index) {
    return City.find({ index });
}

export function countCities() {
    return City.count();
}