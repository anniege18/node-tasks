import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = {
    firstName: String,
    lastName: String,
    gender: { type: String, enum: ['female', 'male'] },
    email: { type: String, unique: true },
    phone: String
};

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
        this.model = mongoose.model('User', new Schema(UserSchema));
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