const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillfusion')
    .then(() => console.log('MongoDB Connected for Debug'))
    .catch(err => console.error(err));

const debugUser = async () => {
    try {
        const count = await User.countDocuments({});
        console.log(`Total users in DB: ${count}`);

        const allUsers = await User.find({}).limit(5);
        console.log('Sample users:', allUsers.map(u => ({ name: u.name, email: u.email, username: u.username })));

        console.log('Checking user alice@mentor.com...');
        const userByEmail = await User.findOne({ email: 'alice@mentor.com' });

        if (userByEmail) {
            console.log('User found by email!');
            console.log('ID:', userByEmail._id);
            console.log('Name:', userByEmail.name);
            console.log('Username:', userByEmail.username);
            console.log('Role:', userByEmail.role);
            console.log('Password:', userByEmail.password);
        } else {
            console.log('User NOT found by email alice@mentor.com');
        }

        console.log('\nChecking user by username alice_mentor...');
        const userByUsername = await User.findOne({ username: 'alice_mentor' });

        if (userByUsername) {
            console.log('User found by username!');
            console.log('ID:', userByUsername._id);
        } else {
            console.log('User NOT found by username alice_mentor');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Debug failed:', err);
        mongoose.connection.close();
    }
};

debugUser();
