require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const verify = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Find a user (any user)
        const user = await User.findOne({});
        if (!user) {
            console.log('No user found');
            return;
        }

        console.log(`Found user: ${user.name}`);

        // 2. Add 'Rising Star' badge manually
        const badge = {
            id: 'rising_star',
            name: 'Rising Star',
            icon: '🌟',
            description: 'Earned your first 50 XP!',
            dateEarned: new Date()
        };

        // Check if badge exists
        if (!user.badges.some(b => b.id === 'rising_star')) {
            user.badges.push(badge);
            await user.save();
            console.log('Added badge to user.');
        } else {
            console.log('User already has badge.');
        }

        // 3. Output user badges
        const updatedUser = await User.findById(user._id);
        console.log('User Badges:', updatedUser.badges);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
