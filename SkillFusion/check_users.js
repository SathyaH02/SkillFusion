const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb+srv://skillFusionUser:SkillFusion%40987@cluster0.wxloftz.mongodb.net/SkillFusion?retryWrites=true&w=majority';

const checkUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Password: ${u.password}, Role: ${u.role}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
