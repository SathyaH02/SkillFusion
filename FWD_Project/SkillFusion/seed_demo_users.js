require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Mentorship = require('./models/Mentorship');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI;

const AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna'
];

const seedDemoUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing demo data
        console.log('Clearing existing demo data...');
        await User.deleteMany({ email: { $regex: '@demo.com$' } });
        await Mentorship.deleteMany({});
        await Notification.deleteMany({});

        const password = 'Demo123!'; // Plain text password

        // Create Students
        console.log('Creating students...');

        const priya = await User.create({
            username: 'priya',
            name: 'Priya Sharma',
            email: 'priya@demo.com',
            password: password,
            role: 'student',
            bio: 'Computer Science student eager to learn web development and design',
            avatar: AVATARS[0],
            skillsToLearn: ['Python', 'Web Development', 'UI/UX Design'],
            skillsToTeach: [],
            xp: 0,
            ratings: [],
            averageRating: 0,
            badges: []
        });

        const rahul = await User.create({
            username: 'rahul',
            name: 'Rahul Verma',
            email: 'rahul@demo.com',
            password: password,
            role: 'student',
            bio: 'Self-taught developer looking to master full-stack development',
            avatar: AVATARS[1],
            skillsToLearn: ['JavaScript', 'React', 'Node.js'],
            skillsToTeach: [],
            xp: 150,
            ratings: [],
            averageRating: 0,
            badges: [
                {
                    id: 'rising_star',
                    name: 'Rising Star',
                    icon: '🌟',
                    description: 'Earned your first 50 XP!',
                    dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
                }
            ]
        });

        const ananya = await User.create({
            username: 'ananya',
            name: 'Ananya Patel',
            email: 'ananya@demo.com',
            password: password,
            role: 'student',
            bio: 'Engineering graduate transitioning to data science',
            avatar: AVATARS[2],
            skillsToLearn: ['AI/ML', 'Data Science', 'Cloud Computing'],
            skillsToTeach: [],
            xp: 500,
            ratings: [],
            averageRating: 0,
            badges: [
                {
                    id: 'rising_star',
                    name: 'Rising Star',
                    icon: '🌟',
                    description: 'Earned your first 50 XP!',
                    dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        // Create Mentors
        console.log('Creating mentors...');

        const arjun = await User.create({
            username: 'arjun',
            name: 'Arjun Singh',
            email: 'arjun@demo.com',
            password: password,
            role: 'mentor',
            bio: 'Frontend developer with 3 years experience, passionate about teaching',
            avatar: AVATARS[3],
            skillsToLearn: [],
            skillsToTeach: ['HTML', 'CSS', 'JavaScript'],
            xp: 80,
            ratings: [4, 5],
            averageRating: 4.5,
            badges: [
                {
                    id: 'rising_star',
                    name: 'Rising Star',
                    icon: '🌟',
                    description: 'Earned your first 50 XP!',
                    dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        const sneha = await User.create({
            username: 'sneha',
            name: 'Sneha Reddy',
            email: 'sneha@demo.com',
            password: password,
            role: 'mentor',
            bio: 'Senior backend developer and coding bootcamp instructor',
            avatar: AVATARS[4],
            skillsToLearn: [],
            skillsToTeach: ['Python', 'Django', 'SQL', 'Git & GitHub'],
            xp: 850,
            ratings: [5, 5, 4, 5, 5, 4, 5],
            averageRating: 4.71,
            badges: [
                {
                    id: 'rising_star',
                    name: 'Rising Star',
                    icon: '🌟',
                    description: 'Earned your first 50 XP!',
                    dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'mentor_star',
                    name: 'Mentor Star',
                    icon: '🎓',
                    description: 'Completed 5 mentorships as a mentor.',
                    dateEarned: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'top_rated',
                    name: 'Top Rated',
                    icon: '⭐',
                    description: 'Maintained a 4.5+ rating with 5+ reviews.',
                    dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        const vikram = await User.create({
            username: 'vikram',
            name: 'Vikram Kumar',
            email: 'vikram@demo.com',
            password: password,
            role: 'mentor',
            bio: 'Full-stack architect with 8+ years experience',
            avatar: AVATARS[5],
            skillsToLearn: [],
            skillsToTeach: ['React', 'Node.js', 'MongoDB', 'AWS', 'DevOps'],
            xp: 1250,
            ratings: [5, 5, 5, 4, 5, 5, 5, 5],
            averageRating: 4.88,
            badges: [
                {
                    id: 'rising_star',
                    name: 'Rising Star',
                    icon: '🌟',
                    description: 'Earned your first 50 XP!',
                    dateEarned: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'skill_master',
                    name: 'Skill Master',
                    icon: '👑',
                    description: 'Reached 1000 XP!',
                    dateEarned: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'mentor_star',
                    name: 'Mentor Star',
                    icon: '🎓',
                    description: 'Completed 5 mentorships as a mentor.',
                    dateEarned: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 'top_rated',
                    name: 'Top Rated',
                    icon: '⭐',
                    description: 'Maintained a 4.5+ rating with 5+ reviews.',
                    dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        // Create Mentorships
        console.log('Creating mentorships...');

        // priya's pending request
        await Mentorship.create({
            student: priya._id,
            mentor: arjun._id,
            skill: 'JavaScript',
            status: 'pending',
            progress: 0
        });

        // rahul's active mentorship
        await Mentorship.create({
            student: rahul._id,
            mentor: sneha._id,
            skill: 'Python',
            status: 'accepted',
            progress: 60,
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        });

        // rahul's completed course
        await Mentorship.create({
            student: rahul._id,
            mentor: arjun._id,
            skill: 'JavaScript',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        // ananya's active mentorships
        await Mentorship.create({
            student: ananya._id,
            mentor: vikram._id,
            skill: 'React',
            status: 'accepted',
            progress: 80,
            startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        });

        // ananya's completed courses
        await Mentorship.create({
            student: ananya._id,
            mentor: sneha._id,
            skill: 'Python',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        await Mentorship.create({
            student: ananya._id,
            mentor: vikram._id,
            skill: 'Node.js',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        // sneha's completed mentorships (for Mentor Star badge)
        const dummyStudent1 = await User.create({
            username: 'test1',
            name: 'Test Student 1',
            email: 'test1@demo.com',
            password: password,
            role: 'student',
            bio: 'Test student',
            avatar: AVATARS[0],
            skillsToLearn: ['Python'],
            xp: 50
        });

        const dummyStudent2 = await User.create({
            username: 'test2',
            name: 'Test Student 2',
            email: 'test2@demo.com',
            password: password,
            role: 'student',
            bio: 'Test student',
            avatar: AVATARS[1],
            skillsToLearn: ['SQL'],
            xp: 50
        });

        await Mentorship.create({
            student: dummyStudent1._id,
            mentor: sneha._id,
            skill: 'Python',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        await Mentorship.create({
            student: dummyStudent2._id,
            mentor: sneha._id,
            skill: 'SQL',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
            rating: 4
        });

        await Mentorship.create({
            student: dummyStudent1._id,
            mentor: sneha._id,
            skill: 'Django',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        // vikram's completed mentorships
        await Mentorship.create({
            student: dummyStudent1._id,
            mentor: vikram._id,
            skill: 'React',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        await Mentorship.create({
            student: dummyStudent2._id,
            mentor: vikram._id,
            skill: 'MongoDB',
            status: 'completed',
            progress: 100,
            startDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
            rating: 5
        });

        // Create sample notifications
        console.log('Creating notifications...');

        await Notification.create({
            userId: arjun._id,
            type: 'request',
            message: `Priya Sharma sent you a mentorship request for JavaScript`,
            relatedId: priya._id,
            read: false
        });

        await Notification.create({
            userId: rahul._id,
            type: 'accept',
            message: 'Your request for Python was accepted by Sneha Reddy!',
            relatedId: sneha._id,
            read: false
        });

        await Notification.create({
            userId: vikram._id,
            type: 'info',
            message: '🏆 New Badge Unlocked: Skill Master!',
            relatedId: vikram._id,
            read: false
        });

        console.log('\n✅ Demo data seeded successfully!\n');
        console.log('=== DEMO USER ACCOUNTS ===\n');
        console.log('STUDENTS:');
        console.log('1. Username: priya    | Email: priya@demo.com   | Password: Demo123!');
        console.log('2. Username: rahul    | Email: rahul@demo.com   | Password: Demo123!');
        console.log('3. Username: ananya   | Email: ananya@demo.com  | Password: Demo123!\n');
        console.log('MENTORS:');
        console.log('4. Username: arjun    | Email: arjun@demo.com   | Password: Demo123!');
        console.log('5. Username: sneha    | Email: sneha@demo.com   | Password: Demo123!');
        console.log('6. Username: vikram   | Email: vikram@demo.com  | Password: Demo123!\n');
        console.log('⚠️  IMPORTANT: Login with USERNAME, not email!\n');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding demo data:', err);
        process.exit(1);
    }
};

seedDemoUsers();
