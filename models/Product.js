import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = {
    index: { type: Number, max: 1000 },
    name: String,
    brand: String,
    company: String,
    price: String,
    isbn: String
};

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
        this.model = mongoose.model('Product', new Schema(ProductSchema));
    }

    async loadProducts(products) {
        await this.model.collection.drop();
        this.model.collection.insert(products, cb);
    }
}

export default Product;