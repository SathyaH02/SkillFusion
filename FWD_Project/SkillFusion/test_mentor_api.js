const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillfusion';

const testApi = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        // Find a mentor
        const mentor = await User.findOne({ role: 'mentor' });
        if (!mentor) {
            console.log('No mentor found in DB');
            process.exit(1);
        }

        console.log(`Found Mentor: ${mentor.name} (${mentor.email}) ID: ${mentor._id}`);
        console.log(`Testing API: http://localhost:5000/api/dashboard/mentor/${mentor._id}`);

        // Fetch data using fetch API
        const response = await fetch(`http://localhost:5000/api/dashboard/mentor/${mentor._id}`);
        const data = await response.json();

        console.log('\n--- API RESPONSE ---');
        console.log(JSON.stringify(data, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

testApi();
