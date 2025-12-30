const mongoose = require('mongoose');

const MentorshipSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Mentorship', MentorshipSchema);
