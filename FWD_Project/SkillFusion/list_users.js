const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/skillfusion';

const listUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const users = await User.find({}).limit(5);
        users.forEach(u => {
            console.log(`User: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
