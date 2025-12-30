const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    type: { type: String, enum: ['request', 'accept', 'reject', 'info'], default: 'info' },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g., Mentorship ID
    read: { type: Boolean, default: false },
    rated: { type: Boolean, default: false },
    ratingValue: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
