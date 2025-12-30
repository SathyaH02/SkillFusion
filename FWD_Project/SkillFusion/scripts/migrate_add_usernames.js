const mongoose = require('mongoose');
const User = require('../models/User');

const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillfusion')
    .then(() => console.log('MongoDB Connected for Migration'))
    .catch(err => console.error(err));

const migrateUsernames = async () => {
    try {
        console.log('Starting username migration...\n');

        // Define username mappings for demo users
        const usernameMappings = {
            'alice@mentor.com': 'alice_mentor',
            'bob@mentor.com': 'bob_mentor',
            'charlie@mentor.com': 'charlie_mentor',
            'david@student.com': 'david_student',
            'eve@student.com': 'eve_student',
            'frank@student.com': 'frank_student',
            'grace@student.com': 'grace_student'
        };

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users to migrate\n`);

        const credentials = [];

        for (const user of users) {
            let username;

            // Check if we have a predefined username for this email
            if (usernameMappings[user.email]) {
                username = usernameMappings[user.email];
            } else {
                // Generate username from name (fallback for any other users)
                username = user.name.toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');

                // Ensure uniqueness by appending role
                username = `${username}_${user.role}`;

                // Truncate to ensure it fits within 20 chars (leaving room for numbers if needed)
                if (username.length > 18) {
                    username = username.substring(0, 18);
                }
            }

            // Check if username already exists (in case of duplicates)
            let finalUsername = username;
            let counter = 1;
            while (await User.findOne({ username: finalUsername })) {
                // If appending number makes it too long, truncate more
                if (`${username}${counter}`.length > 20) {
                    // Take base username minus length of counter
                    const baseLen = 20 - String(counter).length;
                    finalUsername = `${username.substring(0, baseLen)}${counter}`;
                } else {
                    finalUsername = `${username}${counter}`;
                }
                counter++;
            }

            // Update user with username
            user.username = finalUsername;
            await user.save();

            credentials.push({
                name: user.name,
                username: finalUsername,
                email: user.email,
                role: user.role,
                password: 'password123'
            });

            console.log(`✓ Updated ${user.name} (${user.email}) -> username: ${finalUsername}`);
        }

        console.log('\n' + '='.repeat(70));
        console.log('MIGRATION COMPLETE - LOGIN CREDENTIALS');
        console.log('='.repeat(70) + '\n');

        console.log('📝 MENTORS:');
        credentials.filter(c => c.role === 'mentor').forEach(c => {
            console.log(`   Username: ${c.username.padEnd(20)} | Email: ${c.email.padEnd(25)} | Password: ${c.password}`);
        });

        console.log('\n📝 STUDENTS:');
        credentials.filter(c => c.role === 'student').forEach(c => {
            console.log(`   Username: ${c.username.padEnd(20)} | Email: ${c.email.padEnd(25)} | Password: ${c.password}`);
        });

        console.log('\n' + '='.repeat(70));
        console.log('⚠️  IMPORTANT: Login now requires USERNAME instead of email!');
        console.log('='.repeat(70) + '\n');

        mongoose.connection.close();
    } catch (err) {
        console.error('Migration failed:', err);
        mongoose.connection.close();
    }
};

migrateUsernames();
