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
        console.log('1. Priya Sharma - priya@demo.com (Beginner, pending request)');
        console.log('2. Rahul Verma - rahul@demo.com (Active student, 150 XP, 1 badge)');
        console.log('3. Ananya Patel - ananya@demo.com (Advanced, 500 XP, multiple completions)\n');
        console.log('MENTORS:');
        console.log('4. Arjun Singh - arjun@demo.com (New mentor, pending requests)');
        console.log('5. Sneha Reddy - sneha@demo.com (Experienced, 850 XP, 3 badges)');
        console.log('6. Vikram Kumar - vikram@demo.com (Top mentor, 1250 XP, 4 badges)\n');
        console.log('Password for all accounts: Demo123!\n');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding demo data:', err);
        process.exit(1);
    }
};

seedDemoUsers();
