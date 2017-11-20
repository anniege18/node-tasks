import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    index: Number,
    name: String,
    country: String,
    capital: String,
    location: { lat: Number, long: Number }
});

const City = mongoose.model('City', CitySchema, 'city');

