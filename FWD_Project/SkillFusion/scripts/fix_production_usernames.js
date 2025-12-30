require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const fixProductionUsernames = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Define username mappings for demo users
        const usernameMappings = {
            'priya@demo.com': 'priya',
            'rahul@demo.com': 'rahul',
            'ananya@demo.com': 'ananya',
            'arjun@demo.com': 'arjun',
            'sneha@demo.com': 'sneha',
            'vikram@demo.com': 'vikram',
            'test1@demo.com': 'test1',
            'test2@demo.com': 'test2'
        };

        // Find all users without usernames
        const usersWithoutUsernames = await User.find({ username: { $exists: false } });

        if (usersWithoutUsernames.length === 0) {
            console.log('✅ All users already have usernames!\n');

            // Show existing credentials
            const allUsers = await User.find({ email: { $regex: '@demo.com$' } }).select('name username email role');
            console.log('=== CURRENT LOGIN CREDENTIALS ===\n');
            console.log('STUDENTS:');
            allUsers.filter(u => u.role === 'student' && !u.name.includes('Test')).forEach(u => {
                console.log(`   Username: ${u.username.padEnd(15)} | Password: Demo123!`);
            });
            console.log('\nMENTORS:');
            allUsers.filter(u => u.role === 'mentor').forEach(u => {
                console.log(`   Username: ${u.username.padEnd(15)} | Password: Demo123!`);
            });
            console.log('\n⚠️  IMPORTANT: Login with USERNAME, not email!\n');

            mongoose.connection.close();
            return;
        }

        console.log(`Found ${usersWithoutUsernames.length} users without usernames\n`);

        const credentials = [];

        for (const user of usersWithoutUsernames) {
            let username;

            // Check if we have a predefined username for this email
            if (usernameMappings[user.email]) {
                username = usernameMappings[user.email];
            } else {
                // Generate username from email prefix
                username = user.email.split('@')[0].toLowerCase();

                // Ensure it matches the schema pattern (alphanumeric + underscore only)
                username = username.replace(/[^a-z0-9_]/g, '_');

                // Truncate to 20 chars max
                if (username.length > 20) {
                    username = username.substring(0, 20);
                }
            }

            // Check if username already exists (handle duplicates)
            let finalUsername = username;
            let counter = 1;
            while (await User.findOne({ username: finalUsername })) {
                if (`${username}${counter}`.length > 20) {
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
                role: user.role
            });

            console.log(`✓ Updated ${user.name} (${user.email}) → username: ${finalUsername}`);
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ MIGRATION COMPLETE - LOGIN CREDENTIALS');
        console.log('='.repeat(70) + '\n');

        console.log('STUDENTS:');
        credentials.filter(c => c.role === 'student').forEach(c => {
            console.log(`   Username: ${c.username.padEnd(15)} | Password: Demo123!`);
        });

        console.log('\nMENTORS:');
        credentials.filter(c => c.role === 'mentor').forEach(c => {
            console.log(`   Username: ${c.username.padEnd(15)} | Password: Demo123!`);
        });

        console.log('\n' + '='.repeat(70));
        console.log('⚠️  IMPORTANT: Login with USERNAME, not email!');
        console.log('='.repeat(70) + '\n');

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        mongoose.connection.close();
        process.exit(1);
    }
};

fixProductionUsernames();
