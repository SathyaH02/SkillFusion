const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/skillfusion';

const checkRatings = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        const mentors = await User.find({ role: 'mentor' });
        console.log('--- Mentor Ratings ---');
        mentors.forEach(m => {
            console.log(`Name: ${m.name}, ID: ${m._id}`);
            console.log(`Ratings: ${JSON.stringify(m.ratings)}`);
            console.log(`Average: ${m.averageRating}`);
            console.log('----------------------');
        });
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkRatings();
