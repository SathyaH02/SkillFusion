
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const dumpUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});

        console.log('\n=== ALL USERS ===\n');
        users.forEach(u => {
            console.log(`ID: ${u._id}`);
            console.log(`Name: ${u.name}`);
            console.log(`Username: ${u.username}`);
            console.log(`Email: ${u.email}`);
            console.log(`Password: ${u.password}`);
            console.log(`Role: ${u.role}`);
            console.log(`Skills: ${u.skillsToLearn.length ? u.skillsToLearn.join(', ') : u.skillsToTeach.join(', ')}`);
            console.log('---');
        });

        if (users.length === 0) {
            console.log('No users found in database.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpUsers();
