import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    productId: { type: Number, min: 0, max: 60 },
    text: String
});


const cb = (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.info(`Reviews were successfully added in qty ${result.insertedCount}`);
};

class Review {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
        this.model = mongoose.model('Review', ReviewSchema);
    }

    getModel() {
        return this.model;
    }

    async load(reviews) {
        await this.model.collection.drop();
        this.model.collection.insert(reviews, cb);
    }
}

export default Review;