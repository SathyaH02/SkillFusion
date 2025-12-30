
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mentorship = require('../models/Mentorship');

const Notification = require('../models/Notification');

// Badge Logic Helper
const checkAndAwardBadges = async (user) => {
    const badges = user.badges || [];
    const newBadges = [];
    const currentBadgeIds = badges.map(b => b.id);

    // 1. Rising Star: First 50 XP
    if (user.xp >= 50 && !currentBadgeIds.includes('rising_star')) {
        newBadges.push({ id: 'rising_star', name: 'Rising Star', icon: '🌟', description: 'Earned your first 50 XP!' });
    }

    // 2. Skill Master: 1000 XP
    if (user.xp >= 1000 && !currentBadgeIds.includes('skill_master')) {
        newBadges.push({ id: 'skill_master', name: 'Skill Master', icon: '👑', description: 'Reached 1000 XP!' });
    }

    // 3. Top Rated: Average Rating >= 4.5 (min 5 ratings)
    if (user.averageRating >= 4.5 && user.ratings.length >= 5 && !currentBadgeIds.includes('top_rated')) {
        newBadges.push({ id: 'top_rated', name: 'Top Rated', icon: '⭐', description: 'Maintained a 4.5+ rating with 5+ reviews.' });
    }

    // 4. Mentor Star: Completed 5 mentorships as mentor
    if (!currentBadgeIds.includes('mentor_star')) {
        const completedCount = await Mentorship.countDocuments({ mentor: user._id, status: 'completed' });
        if (completedCount >= 5) {
            newBadges.push({ id: 'mentor_star', name: 'Mentor Star', icon: '🎓', description: 'Completed 5 mentorships as a mentor.' });
        }
    }

    if (newBadges.length > 0) {
        user.badges = [...badges, ...newBadges];
        await user.save();

        // Create notifications for new badges
        for (const badge of newBadges) {
            await new Notification({
                userId: user._id,
                type: 'info',
                message: `🏆 New Badge Unlocked: ${badge.name}!`,
                relatedId: user._id // Linking to profile
            }).save();
        }
    }
    return user;
};

// Get all mentors
router.get('/mentors', async (req, res) => {
    try {
        const mentors = await User.find({ role: 'mentor' });
        res.json(mentors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find({}).sort({ xp: -1 }).limit(10).select('name role xp avatar badges');
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Request a mentorship
router.post('/request', async (req, res) => {
    const { studentId, mentorId, skill } = req.body;
    try {
        // Only block if there's an active (pending or accepted) mentorship
        // Allow new requests for completed courses
        const existing = await Mentorship.findOne({
            student: studentId,
            mentor: mentorId,
            skill,
            status: { $in: ['pending', 'accepted'] }
        });
        if (existing) return res.status(400).json({ message: 'Request already sent' });

        const newMentorship = new Mentorship({ student: studentId, mentor: mentorId, skill });
        await newMentorship.save();

        // Notify Mentor
        const student = await User.findById(studentId);
        await new Notification({
            userId: mentorId,
            type: 'request',
            message: `New mentorship request: ${student.name} wants to learn ${skill}`,
            relatedId: newMentorship._id
        }).save();

        res.status(201).json({ message: 'Request sent successfully!', mentorship: newMentorship });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Student Dashboard Data
router.get('/dashboard/student/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const mentorships = await Mentorship.find({ student: userId }).populate('mentor', 'name email');
        res.json(mentorships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mentor Dashboard Data
router.get('/dashboard/mentor/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await Mentorship.find({ mentor: userId }).populate('student', 'name email');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept a mentorship
// Accept a mentorship
router.put('/accept', async (req, res) => {
    const { mentorshipId } = req.body;
    try {
        const mentorship = await Mentorship.findByIdAndUpdate(mentorshipId, { status: 'accepted', startDate: Date.now() }, { new: true }).populate('mentor');

        // Award XP to Mentor for accepting
        const mentor = await User.findById(mentorship.mentor._id);
        mentor.xp += 5;
        await mentor.save();
        await checkAndAwardBadges(mentor);

        // Notify Student

        // Notify Student
        await new Notification({
            userId: mentorship.student,
            type: 'accept',
            message: 'Your request for ' + mentorship.skill + ' was accepted by ' + mentorship.mentor.name + '!',
            relatedId: mentorship._id
        }).save();

        res.json(mentorship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reject a mentorship
router.put('/reject', async (req, res) => {
    const { mentorshipId } = req.body;
    console.log('Rejecting mentorship:', mentorshipId);
    try {
        const mentorship = await Mentorship.findByIdAndUpdate(mentorshipId, { status: 'rejected' }, { new: true }).populate('mentor');

        // Notify Student
        await new Notification({
            userId: mentorship.student,
            type: 'reject',
            message: 'Your request for ' + mentorship.skill + ' was declined by ' + mentorship.mentor.name + '.',
            relatedId: mentorship._id
        }).save();

        res.json(mentorship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel a mentorship request (by student)
router.put('/cancel', async (req, res) => {
    const { mentorshipId } = req.body;
    try {
        const mentorship = await Mentorship.findById(mentorshipId).populate('mentor student');

        if (!mentorship) {
            return res.status(404).json({ error: 'Mentorship not found' });
        }

        // Delete the mentorship
        await Mentorship.findByIdAndDelete(mentorshipId);

        // Notify Mentor
        await new Notification({
            userId: mentorship.mentor._id,
            type: 'info',
            message: `${mentorship.student.name} canceled their request for ${mentorship.skill}`,
            relatedId: mentorshipId
        }).save();

        res.json({ success: true, message: 'Request canceled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rate Mentor
router.post('/rate-mentor', async (req, res) => {
    const { mentorshipId, rating, notificationId } = req.body;
    try {
        const mentorship = await Mentorship.findById(mentorshipId).populate('mentor');
        if (!mentorship) return res.status(404).json({ error: 'Mentorship not found' });

        const mentor = mentorship.mentor;
        mentor.ratings.push(rating);
        mentor.averageRating = mentor.ratings.reduce((a, b) => a + b, 0) / mentor.ratings.length;

        // Award XP for rating (Rating * 10)
        mentor.xp += rating * 10;

        await mentor.save();
        await checkAndAwardBadges(mentor);

        mentorship.rating = rating;
        await mentorship.save();

        if (notificationId) {
            await Notification.findByIdAndUpdate(notificationId, { rated: true, ratingValue: rating });
        }

        res.json({ success: true, averageRating: mentor.averageRating });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update progress
router.put('/progress', async (req, res) => {
    const { mentorshipId, progress } = req.body;
    try {
        const mentorship = await Mentorship.findByIdAndUpdate(mentorshipId, { progress }, { new: true }).populate('student');
        if (progress === 100) {
            mentorship.status = 'completed';
            await mentorship.save();

            // Remove the skill from student's skillsToLearn profile
            const student = mentorship.student;
            if (student && student.skillsToLearn && student.skillsToLearn.includes(mentorship.skill)) {
                student.skillsToLearn = student.skillsToLearn.filter(s => s !== mentorship.skill);
                // Award XP to Student for completion
                student.xp += 50;
                await student.save();
                await checkAndAwardBadges(student);
            }

            // Award XP to Mentor for completion
            const mentor = await User.findById(mentorship.mentor);
            if (mentor) {
                mentor.xp += 100;
                await mentor.save();
                await checkAndAwardBadges(mentor);
            }

            // Notify Student of Completion
            await new Notification({
                userId: mentorship.student._id,
                type: 'info',
                message: 'Congratulations! You have completed the ' + mentorship.skill + ' course!',
                relatedId: mentorship._id
            }).save();
        }
        res.json(mentorship);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Notifications
router.get('/notifications/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark Notification Read
router.put('/notifications/:id/read', async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Get Profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { bio, avatar, skillsToLearn, skillsToTeach } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { bio, avatar, skillsToLearn, skillsToTeach },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TEMPORARY: Admin endpoint to fix usernames in production
// Remove this after running once
router.post('/admin/fix-usernames', async (req, res) => {
    try {
        const { adminSecret } = req.body;

        // Simple security check
        if (adminSecret !== 'FixUsernames2024!') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const usernameMappings = {
            'priya@demo.com': 'priya',
            'rahul@demo.com': 'rahul',
            'ananya@demo.com': 'ananya',
            'arjun@demo.com': 'arjun',
            'sneha@demo.com': 'sneha',
            'vikram@demo.com': 'vikram',
            'test1@demo.com': 'test1',
            'test2@demo.com': 'test2'
        };

        const usersWithoutUsernames = await User.find({ username: { $exists: false } });

        if (usersWithoutUsernames.length === 0) {
            return res.json({
                success: true,
                message: 'All users already have usernames!',
                credentials: await User.find({ email: { $regex: '@demo.com$' } }).select('username email role')
            });
        }

        const credentials = [];

        for (const user of usersWithoutUsernames) {
            let username = usernameMappings[user.email] || user.email.split('@')[0].toLowerCase();
            username = username.replace(/[^a-z0-9_]/g, '_');
            if (username.length > 20) username = username.substring(0, 20);

            let finalUsername = username;
            let counter = 1;
            while (await User.findOne({ username: finalUsername })) {
                finalUsername = `${username}${counter}`;
                counter++;
            }

            user.username = finalUsername;
            await user.save();

            credentials.push({
                name: user.name,
                username: finalUsername,
                email: user.email,
                role: user.role
            });
        }

        res.json({
            success: true,
            message: `Fixed ${credentials.length} users`,
            credentials
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
