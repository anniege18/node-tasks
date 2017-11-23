import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    index: { type: Number, max: 1000, unique: true },
    name: String,
    brand: String,
    company: String,
    price: String,
    isbn: String,
    lastModifiedDate: Date
});

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: 'index',
    foreignField: 'productId',
    justOne: false
});

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

ProductSchema.pre('save', function(next) {
    this.lastModifiedDate = new Date();
    next();
});

const cb = (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.info(`Products were successfully added in qty ${result.insertedCount}`);
};

class Product {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
        this.model = mongoose.model('Product', ProductSchema);
    }

    getModel() {
        return this.model;
    }

    async loadProducts(products) {
        await this.model.collection.drop();
        this.model.collection.insert(products, cb);
    }
}

export default Product;