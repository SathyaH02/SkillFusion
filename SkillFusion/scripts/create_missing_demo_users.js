const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillfusion')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const createUsers = async () => {
    try {
        const password = 'password123';

        const users = [
            // Mentors
            {
                name: 'Mentor Alice',
                email: 'alice@mentor.com',
                username: 'alice_mentor',
                role: 'mentor',
                skillsToTeach: ['JavaScript', 'React'],
                bio: 'Passionate about frontend development.'
            },
            {
                name: 'Mentor Bob',
                email: 'bob@mentor.com',
                username: 'bob_mentor',
                role: 'mentor',
                skillsToTeach: ['Python', 'Django'],
                bio: 'Backend expert.'
            },
            {
                name: 'Mentor Charlie',
                email: 'charlie@mentor.com',
                username: 'charlie_mentor',
                role: 'mentor',
                skillsToTeach: ['Java', 'Spring'],
                bio: 'Enterprise application developer.'
            },
            // Students
            {
                name: 'Student David',
                email: 'david@student.com',
                username: 'david_student',
                role: 'student',
                skillsToLearn: ['JavaScript'],
                bio: 'Eager to learn.'
            },
            {
                name: 'Student Eve',
                email: 'eve@student.com',
                username: 'eve_student',
                role: 'student',
                skillsToLearn: ['Python'],
                bio: 'Data science enthusiast.'
            },
            {
                name: 'Student Frank',
                email: 'frank@student.com',
                username: 'frank_student',
                role: 'student',
                skillsToLearn: ['Java'],
                bio: 'Java fan.'
            }
        ];

        for (const u of users) {
            // Check if exists by username or email
            const existing = await User.findOne({
                $or: [{ email: u.email }, { username: u.username }]
            });

            if (existing) {
                console.log(`Skipping ${u.username} (already exists)`);
                // process.stdout.write(`Updating ${u.username} password... `);
                // existing.password = password;
                // await existing.save();
                // console.log('Done.');
            } else {
                await User.create({
                    ...u,
                    password: password
                });
                console.log(`Created ${u.username}`);
            }
        }

        console.log('Seeding complete.');
        mongoose.connection.close();
    } catch (err) {
        console.error('Seeding failed:', err);
        mongoose.connection.close();
    }
};

createUsers();
