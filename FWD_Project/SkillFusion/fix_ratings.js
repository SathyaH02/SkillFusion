const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Mentorship = require('./models/Mentorship');

const MONGO_URI = 'mongodb://127.0.0.1:27017/skillfusion';

const fixRatings = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const ratedNotifications = await Notification.find({ rated: true });
        console.log(`Found ${ratedNotifications.length} rated notifications.`);

        for (const notif of ratedNotifications) {
            if (notif.ratingValue) {
                console.log(`Recovering rating ${notif.ratingValue} for Mentorship ${notif.relatedId}`);
                await Mentorship.findByIdAndUpdate(notif.relatedId, { rating: notif.ratingValue });
            } else {
                console.log(`Notification ${notif._id} is rated but has no value. Resetting to allow re-rating.`);
                await Notification.findByIdAndUpdate(notif._id, { rated: false });
            }
        }

        console.log('Done!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixRatings();
