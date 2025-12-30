const mongoose = require('mongoose');
const User = require('./models/User');
const Mentorship = require('./models/Mentorship');
const Notification = require('./models/Notification');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillfusion', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // 1. Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Mentorship.deleteMany({});
        await Notification.deleteMany({});

        // 2. Create Mentors
        console.log('Creating Mentors...');

        const mentorAlice = await new User({
            name: 'Mentor Alice',
            email: 'alice@mentor.com',
            password: 'password123',
            role: 'mentor',
            bio: 'Expert in Finance and Marketing with 10 years of experience.',
            skillsToTeach: ['Finance', 'Marketing'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
            averageRating: 4.8,
            ratings: [5, 5, 4, 5]
        }).save();

        const mentorBob = await new User({
            name: 'Mentor Bob',
            email: 'bob@mentor.com',
            password: 'password123',
            role: 'mentor',
            bio: 'Senior Developer and Designer. I love teaching coding!',
            skillsToTeach: ['Coding', 'Design'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
            averageRating: 5.0,
            ratings: [5, 5]
        }).save();

        const mentorCharlie = await new User({
            name: 'Mentor Charlie',
            email: 'charlie@mentor.com',
            password: 'password123',
            role: 'mentor',
            bio: 'A professional chef willing to share culinary secrets.',
            skillsToTeach: ['Cooking'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
            averageRating: 0,
            ratings: []
        }).save();

        // 3. Create Students
        console.log('Creating Students...');

        const studentDavid = await new User({
            name: 'Student David',
            email: 'david@student.com',
            password: 'password123',
            role: 'student',
            bio: 'Eager to learn Finance.',
            skillsToLearn: ['Finance'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
        }).save();

        const studentEve = await new User({
            name: 'Student Eve',
            email: 'eve@student.com',
            password: 'password123',
            role: 'student',
            bio: 'Aspiring Full Stack Developer.',
            skillsToLearn: ['Coding'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve'
        }).save();

        const studentFrank = await new User({
            name: 'Student Frank',
            email: 'frank@student.com',
            password: 'password123',
            role: 'student',
            bio: 'Love food, want to learn to cook.',
            skillsToLearn: ['Cooking'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank'
        }).save();

        const studentGrace = await new User({
            name: 'Student Grace',
            email: 'grace@student.com',
            password: 'password123',
            role: 'student',
            bio: 'New here! Interested in everything.',
            skillsToLearn: ['Marketing', 'Design'],
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace'
        }).save();

        // 4. Create Mentorships
        console.log('Creating Mentorships...');

        // Active: David learning Finance from Alice
        await new Mentorship({
            student: studentDavid._id,
            mentor: mentorAlice._id,
            skill: 'Finance',
            status: 'accepted',
            progress: 45
        }).save();

        // Completed: David completed Marketing with Alice (Testing mentor name display)
        await new Mentorship({
            student: studentDavid._id,
            mentor: mentorAlice._id,
            skill: 'Marketing',
            status: 'completed',
            progress: 100,
            rating: 5
        }).save();

        // Completed: Eve completed Coding with Bob
        await new Mentorship({
            student: studentEve._id,
            mentor: mentorBob._id,
            skill: 'Coding',
            status: 'completed',
            progress: 100,
            rating: 5
        }).save();

        // Pending: Frank requests Cooking from Charlie
        await new Mentorship({
            student: studentFrank._id,
            mentor: mentorCharlie._id,
            skill: 'Cooking',
            status: 'pending'
        }).save();

        // Pending: Grace requests Design from Bob
        await new Mentorship({
            student: studentGrace._id,
            mentor: mentorBob._id,
            skill: 'Design',
            status: 'pending'
        }).save();

        // 5. Create Notifications (Mocking some recent activity)
        console.log('Creating Notifications...');

        await new Notification({
            user: mentorCharlie._id,
            message: 'You have a new mentorship request from Student Frank for Cooking.',
            type: 'request',
            read: false
        }).save();

        await new Notification({
            user: studentDavid._id,
            message: 'Your progress in Finance was updated to 45%.',
            type: 'info',
            read: true
        }).save();

        console.log('Database Seeded Successfully!');
        console.log('-----------------------------------');
        console.log('Test Users Created:');
        console.log('Mentors:');
        console.log(' - Alice (alice@mentor.com): Active(1), Completed(1)');
        console.log(' - Bob (bob@mentor.com): Completed(1), Pending(1)');
        console.log(' - Charlie (charlie@mentor.com): Pending(1)');
        console.log('Students:');
        console.log(' - David (david@student.com): Learning Finance, Completed Marketing');
        console.log(' - Eve (eve@student.com): Completed Coding');
        console.log(' - Frank (frank@student.com): Pending Cooking');
        console.log(' - Grace (grace@student.com): Pending Design');
        console.log('Password for all: password123');
        console.log('-----------------------------------');

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
};

seedData();
