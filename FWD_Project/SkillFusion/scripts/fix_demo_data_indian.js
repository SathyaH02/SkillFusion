const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillfusion')
    .then(() => console.log('MongoDB Connected for Cleanup'))
    .catch(err => console.error(err));

const fixDemoData = async () => {
    try {
        console.log('Cleaning up Western demo users...');
        const westernEmails = [
            'alice@mentor.com', 'bob@mentor.com', 'charlie@mentor.com',
            'david@student.com', 'eve@student.com', 'frank@student.com'
        ];

        await User.deleteMany({ email: { $in: westernEmails } });
        console.log('Removed Alice, Bob, etc.');

        console.log('Updating Indian demo users...');
        const userUpdates = [
            { email: 'priya@demo.com', username: 'priya_student', role: 'student' },
            { email: 'rahul@demo.com', username: 'rahul_student', role: 'student' },
            { email: 'ananya@demo.com', username: 'ananya_student', role: 'student' },
            { email: 'arjun@demo.com', username: 'arjun_mentor', role: 'mentor' },
            { email: 'sneha@demo.com', username: 'sneha_mentor', role: 'mentor' },
            { email: 'vikram@demo.com', username: 'vikram_mentor', role: 'mentor' }
        ];

        const password = 'password123'; // Setting consistent password

        for (const update of userUpdates) {
            const user = await User.findOne({ email: update.email });
            if (user) {
                user.username = update.username;
                user.password = password; // Update password to be consistent
                await user.save();
                console.log(`Updated ${user.name} -> username: ${user.username}`);
            } else {
                console.log(`User ${update.email} not found! Creating...`);
                // Create if missing (fallback)
                const name = update.email.split('@')[0];
                const displayName = name.charAt(0).toUpperCase() + name.slice(1); // e.g. Priya

                await User.create({
                    name: displayName,
                    email: update.email,
                    username: update.username,
                    password: password,
                    role: update.role
                });
                console.log(`Created ${update.username}`);
            }
        }

        console.log('\nUPDATE COMPLETE. Credentials:');
        userUpdates.forEach(u => {
            console.log(`- ${u.username} (${u.email}) : ${password}`);
        });

        mongoose.connection.close();
    } catch (err) {
        console.error('Cleanup failed:', err);
        mongoose.connection.close();
    }
};

fixDemoData();
