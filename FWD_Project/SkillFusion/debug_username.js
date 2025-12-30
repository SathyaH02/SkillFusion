
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsername = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const username = 'ram_mentor';
        console.log(`Checking for username: ${username}`);

        // Case-insensitive check
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        
        if (user) {
            console.log('User FOUND:', user);
        } else {
            console.log('User NOT found.');
        }

        console.log('Listing all users:');
        const allUsers = await User.find({}, 'username email');
        console.log(allUsers);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsername();
