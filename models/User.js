import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    index: { type: Number, max: 1000, unique: true },
    firstName: String,
    lastName: String,
    gender: { type: String, enum: ['female', 'male'] },
    email: { type: String, unique: true },
    phone: String
});

UserSchema.pre('save', function(next) {
    this.lastModifiedDate = new Date();
    next();
});

const cb = (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.info(`Users were successfully added in qty ${result.insertedCount}`);
};

class User {
    constructor() {
        mongoose.connect('mongodb://localhost:27017/test', { useMongoClient: true });
        this.model = mongoose.model('User', UserSchema);
    }

    getModel() {
        return this.model;
    }

    async loadUsers(users) {
        await this.model.collection.drop();
        this.model.collection.insert(users, cb);
    }
}

export default User;