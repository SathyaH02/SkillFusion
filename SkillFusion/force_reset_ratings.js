const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Mentorship = require('./models/Mentorship');

const MONGO_URI = 'mongodb://127.0.0.1:27017/skillfusion';

const forceReset = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const mentorships = await Mentorship.find({ status: 'completed' });
        console.log(`Found ${mentorships.length} completed mentorships.`);

        for (const m of mentorships) {
            console.log(`Resetting Mentorship ${m._id}`);
            // Reset mentorship rating
            m.rating = undefined;
            await Mentorship.findByIdAndUpdate(m._id, { $unset: { rating: 1 } });

            // Find notification
            const notifs = await Notification.find({ relatedId: m._id });
            for (const n of notifs) {
                console.log(`  Resetting Notification ${n._id}`);
                n.rated = false;
                n.ratingValue = undefined;
                await Notification.findByIdAndUpdate(n._id, { rated: false, $unset: { ratingValue: 1 } });
            }
        }

        console.log('Reset complete. Students should be able to rate again.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

forceReset();
