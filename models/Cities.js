import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const CitiesSchema = new Schema({
    index: { type: Number, max: 99, required: true, unique: true },
    name: String,
    country: String,
    capital: { type: Boolean, required: true },
    location: { lat: Number, long: Number },
    lastModifiedDate: Date
});

CitiesSchema.pre('save', function(next) {
    this.lastModifiedDate = new Date();
    next();
});

CitiesSchema.pre('findOneAndUpdate', function(next) {
    this.update({},{ $set: { lastModifiedDate: new Date() } });
    next();
});

const cb = (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.info(`Cities were successfully added in qty ${result.insertedCount}`);
};

class Cities {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
        this.model = mongoose.model('Cities', CitiesSchema, 'city');
    }

    getModel() {
        return this.model;
    }

    findCity(index) {
        return this.model.findOne({ index });
    }

    countCities() {
        return this.model.count();
    }

    async loadUsers(cities) {
        await this.model.collection.drop();
        this.model.collection.insert(cities, cb);
    }
}

export default Cities;

