import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const CitiesSchema = {
    index: { type: Number, max: 99, required: true, unique: true },
    name: String,
    country: String,
    capital: { type: Boolean, required: [() => this.name !== '', 'capital value required if city name specified'] },
    location: { lat: Number, long: Number }
};


class Cities {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
        this.model = mongoose.model('Cities', new Schema(CitiesSchema), 'city');
    }

    findCity(index) {
        return this.model.find({ index });
    }

    countCities() {
        return this.model.count();
    }
}

export default Cities;

