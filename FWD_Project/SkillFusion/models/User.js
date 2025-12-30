const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/
    },
    name: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique constraint
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'mentor'], required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: 'avatar1' }, // e.g. avatar1, avatar2, etc.
    skillsToLearn: { type: [String], default: [] },
    skillsToTeach: { type: [String], default: [] },
    ratings: { type: [Number], default: [] },
    averageRating: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    badges: [{
        id: String,
        name: String,
        icon: String,
        description: String,
        dateEarned: { type: Date, default: Date.now }
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

// Compound index to ensure same email can't have duplicate roles
UserSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
