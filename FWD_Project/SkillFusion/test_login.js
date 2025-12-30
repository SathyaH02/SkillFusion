const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb+srv://skillFusionUser:SkillFusion%40987@cluster0.wxloftz.mongodb.net/SkillFusion?retryWrites=true&w=majority';

const testLogin = async (email, password) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        console.log(`Attempting login for: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found.');
        } else {
            console.log(`User found: ${user.email}`);
            console.log(`Stored password: '${user.password}'`);
            console.log(`Input password:  '${password}'`);

            if (user.password === password) {
                console.log('LOGIN SUCCESS! Passwords match.');
            } else {
                console.log('LOGIN FAILED! Passwords do not match.');
                console.log(`Length stored: ${user.password.length}, Length input: ${password.length}`);

                // Check char codes
                for (let i = 0; i < Math.max(user.password.length, password.length); i++) {
                    const c1 = user.password.charCodeAt(i);
                    const c2 = password.charCodeAt(i);
                    if (c1 !== c2) {
                        console.log(`Mismatch at index ${i}: stored=${c1} input=${c2}`);
                    }
                }
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin('coder@test.com', 'password123');
