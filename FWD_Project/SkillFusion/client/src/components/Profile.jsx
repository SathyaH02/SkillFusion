import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy'
];

const SKILL_OPTIONS = [
    "Python", "C", "C++", "Java", "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
    "Django", "Flask", "SQL", "MongoDB", "PostgreSQL", "AI/ML", "Data Science", "Cybersecurity",
    "Cloud Computing", "AWS", "Azure", "DevOps", "Git & GitHub", "UI/UX Design", "Web Development",
    "Mobile App Development", "IoT", "Blockchain", "Game Development", "Testing", "Networking",
    "System Design", "Embedded Systems", "Software Engineering", "AI Prompting", "Chatbot Development",
    "Photography", "Video Editing", "Music Production", "Singing", "Dancing", "Acting",
    "Content Writing", "Creative Writing", "Public Speaking", "Sketching", "Painting",
    "Illustration", "Filmmaking", "Voice Acting", "3D Modelling", "Animation", "Podcasting",
    "Marketing", "Finance", "Accounting", "Entrepreneurship", "Leadership", "Management",
    "Negotiation", "Event Planning", "Sales", "Digital Marketing", "SEO", "Business Analytics",
    "Project Management", "Customer Service", "Human Resources", "Team Building",
    "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Medical Science",
    "Economics", "Psychology", "Sociology", "Political Science", "Geography", "History",
    "Philosophy", "Education", "Teaching", "Research Methodology", "Statistics", "Astronomy",
    "Yoga", "Fitness", "Cooking", "Baking", "Gardening", "Language Learning", "Time Management",
    "Mindfulness", "Coaching", "Volunteering", "Career Guidance", "Meditation",
    "Fashion Design", "Graphic Design", "Crafting", "Photography Editing", "Interior Design",
    "Pet Training", "Culinary Arts", "Architecture", "Robotics"
].sort();

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    // Ensure no trailing slash
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        avatar: user?.avatar === 'avatar1' ? AVATARS[0] : user?.avatar,
        skillsToLearn: user?.skillsToLearn || [],
        skillsToTeach: user?.skillsToTeach || []
    });
    const [activeSkills, setActiveSkills] = useState([]);

    useEffect(() => {
        if (user && user.role === 'student') {
            fetch(`${API_URL}/api/dashboard/student/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    const active = data
                        .filter(m => m.status === 'accepted' || m.status === 'pending')
                        .map(m => m.skill);
                    setActiveSkills(active);
                })
                .catch(err => console.error("Failed to fetch mentorships", err));
        }
        if (user && user.role === 'mentor') {
            fetch(`${API_URL}/api/dashboard/mentor/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    const active = data
                        .filter(m => m.status === 'accepted')
                        .map(m => m.skill);
                    setActiveSkills(active);
                })
                .catch(err => console.error("Failed to fetch mentor requests", err));
        }
    }, [user]);

    const handleAvatarSelect = (url) => {
        setFormData({ ...formData, avatar: url });
    };

    const handleSkillChange = (e, type) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData({ ...formData, [type]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/profile/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                updateUser(updatedUser);
                navigate('/dashboard');
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSkill = (skill, type) => {
        // Prevent deselecting active skills for both student and mentor
        if ((type === 'skillsToLearn' || type === 'skillsToTeach') && activeSkills.includes(skill)) {
            const roleAction = type === 'skillsToLearn' ? 'learning it' : 'teaching it';
            alert(`You cannot remove ${skill} while you have an active mentorship or request related to it.`);
            return;
        }

        const currentSkills = formData[type];
        if (currentSkills.includes(skill)) {
            setFormData({ ...formData, [type]: currentSkills.filter(s => s !== skill) });
        } else {
            setFormData({ ...formData, [type]: [...currentSkills, skill] });
        }
    };

    return (
        <div className="card-blue" style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Complete Your Profile</h2>

            {/* Badges Section */}
            {user?.badges && user.badges.length > 0 && (
                <div style={{ marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🏆 Earned Badges <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>({user.badges.length})</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {user.badges.map((badge, index) => (
                            <div key={index} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '999px',
                                border: '1px solid #cbd5e1'
                            }} title={badge.description}>
                                <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="section" style={{ marginBottom: '2rem' }}>
                    <label className="section-title">Choose Avatar</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                        {AVATARS.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt="Avatar"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    border: formData.avatar === avatar ? '4px solid var(--primary-color)' : '2px solid transparent'
                                }}
                                onClick={() => handleAvatarSelect(avatar)}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Bio (Max 100 words)</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                    ></textarea>
                </div>

                <div className="grid-cols-2">
                    {user?.role === 'student' && (
                        <div className="form-group">
                            <label>Skills I Want to Learn</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                {SKILL_OPTIONS.map(skill => {
                                    const isActive = activeSkills.includes(skill);
                                    return (
                                        <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: isActive ? 'not-allowed' : 'pointer', color: isActive ? '#64748b' : 'inherit' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.skillsToLearn.includes(skill)}
                                                onChange={() => toggleSkill(skill, 'skillsToLearn')}
                                                disabled={isActive}
                                            />
                                            {skill} {isActive && '(Active)'}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {user?.role === 'mentor' && (
                        <div className="form-group">
                            <label>Skills I Can Teach</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                {SKILL_OPTIONS.map(skill => {
                                    const isActive = activeSkills.includes(skill);
                                    return (
                                        <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: isActive ? 'not-allowed' : 'pointer', color: isActive ? '#64748b' : 'inherit' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.skillsToTeach.includes(skill)}
                                                onChange={() => toggleSkill(skill, 'skillsToTeach')}
                                                disabled={isActive}
                                            />
                                            {skill} {isActive && '(Active)'}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}>Save Profile</button>
            </form>
        </div>
    );
};

export default Profile;
