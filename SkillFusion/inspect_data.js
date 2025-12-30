const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Mentorship = require('./models/Mentorship');

const MONGO_URI = 'mongodb://127.0.0.1:27017/skillfusion';

const inspectData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        console.log('--- COMPLETED MENTORSHIPS ---');
        const mentorships = await Mentorship.find({ status: 'completed' });
        console.log(JSON.stringify(mentorships, null, 2));

        console.log('\n--- RATED NOTIFICATIONS ---');
        const notifications = await Notification.find({ rated: true });
        console.log(JSON.stringify(notifications, null, 2));

        console.log('\n--- ALL NOTIFICATIONS WITH RELATED ID ---');
        // Check for any notification that might link to these mentorships
        const mentorShipIds = mentorships.map(m => m._id);
        const relatedNotifs = await Notification.find({ relatedId: { $in: mentorShipIds } });
        console.log(JSON.stringify(relatedNotifs, null, 2));


        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspectData();
