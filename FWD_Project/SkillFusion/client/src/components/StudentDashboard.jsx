import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';

const StudentDashboard = () => {
    const { user, updateUser } = useAuth();
    const [allMentorships, setAllMentorships] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);
    // Removed learnAgainSkills state as we can rely on user.skillsToLearn


    useEffect(() => {
        const fetchData = async () => {
            try {
                // 0. Fetch fresh user profile to get updated skillsToLearn
                const resProfile = await fetch(`http://localhost:5000/api/profile/${user._id}`);
                const freshUserData = await resProfile.json();
                // Update user context with fresh data
                updateUser(freshUserData);

                // 1. Get student's mentorships
                const resMentorships = await fetch(`http://localhost:5000/api/dashboard/student/${user._id}`);
                const dataMentorships = await resMentorships.json();
                setAllMentorships(dataMentorships || []);

                // 2. Get available mentors
                const resMentors = await fetch('http://localhost:5000/api/mentors');
                const allMentors = await resMentors.json();

                // Filter mentors based on FRESH skills data
                const relevantMentors = allMentors.filter(mentor => {
                    if (!freshUserData.skillsToLearn || freshUserData.skillsToLearn.length === 0) return true;
                    const mentorSkills = mentor.skillsToTeach || [];
                    return mentorSkills.some(skill => freshUserData.skillsToLearn.includes(skill));
                });

                setMentors(relevantMentors);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user._id]); // Changed dependency to user._id to avoid infinite loop

    const handleRequest = async (mentorId, skill) => {
        try {
            const res = await fetch('http://localhost:5000/api/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: user._id, mentorId, skill })
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Request sent successfully!');
                window.location.reload();
            } else {
                alert(data.message || data.error || 'Failed to send request');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending request. Please try again.');
        }
    };

    const handleLearnAgain = async (skill) => {
        try {
            // Add the skill back to skillsToLearn locally first for immediate UI update
            const updatedSkills = [...(user.skillsToLearn || [])];
            if (!updatedSkills.includes(skill)) {
                updatedSkills.push(skill);
            }

            const res = await fetch(`http://localhost:5000/api/profile/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skillsToLearn: updatedSkills,
                    bio: user.bio,
                    avatar: user.avatar,
                    skillsToTeach: user.skillsToTeach
                })
            });

            if (res.ok) {
                // Update user context immediately to reflect changes in UI
                const updatedUser = { ...user, skillsToLearn: updatedSkills };
                updateUser(updatedUser);
                alert(`${skill} has been added back to your learning list!`);
                // Reload to refresh mentors list and show updated dashboard
                window.location.reload();
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating profile');
        }
    };

    const handleCancelRequest = async (mentorshipId, skill) => {
        if (!window.confirm(`Are you sure you want to cancel your request for ${skill}?`)) {
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/cancel', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentorshipId })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Request canceled successfully');
                window.location.reload();
            } else {
                console.error('Cancel failed:', data);
                alert(data.error || 'Failed to cancel request');
            }
        } catch (err) {
            console.error('Cancel error:', err);
            alert('Error canceling request: ' + err.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    const activeMentorships = allMentorships.filter(m => m.status !== 'completed');
    const completedCourses = allMentorships.filter(m => m.status === 'completed');

    // Get list of completed skill names
    const completedSkillNames = completedCourses.map(m => m.skill);

    // Filter out completed skills from skillsToLearn for the count
    const activeSkillsToLearn = (user.skillsToLearn || []).filter(skill => !completedSkillNames.includes(skill));

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* 1. Available Mentors (Top Priority - Full Width Blue Box) */}
                <div className="card-blue">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className="card-title" style={{ margin: 0, border: 'none', fontSize: '1.25rem' }}>Available Mentors</h3>
                        {user.skillsToLearn?.length > 0 && (
                            <span style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', color: '#1e40af', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                Matching: <strong>{user.skillsToLearn.join(', ')}</strong>
                            </span>
                        )}
                    </div>

                    {mentors.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '0.5rem', color: '#64748b', border: '1px solid rgba(0,0,0,0.1)' }}>
                            No mentors found matching your specific interests.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {mentors.map(mentor => (
                                <div
                                    key={mentor._id}
                                    onClick={() => setSelectedMentor(mentor)}
                                    style={{
                                        background: 'white',
                                        padding: '1rem',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        color: '#1e293b',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{mentor.name}</span>
                                        {mentor.averageRating > 0 ? (
                                            <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★ {mentor.averageRating.toFixed(1)}</span>
                                        ) : <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>New</span>}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>Teaches: {mentor.skillsToTeach?.join(', ')}</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {mentor.skillsToTeach?.map(skill => {
                                            // Check if skill is in student's profile
                                            const isInProfile = user.skillsToLearn?.includes(skill);

                                            // Check status for this skill (from ANY mentor)
                                            // Check status for this skill (from ANY mentor)
                                            // Prioritize active (accepted/pending) mentorships over completed ones
                                            const mentorshipsForSkill = allMentorships.filter(m => m.skill === skill);
                                            const activeMentorship = mentorshipsForSkill.find(m => m.status === 'accepted' || m.status === 'pending');
                                            const completedMentorship = mentorshipsForSkill.find(m => m.status === 'completed');

                                            // Determine status flags
                                            const isAccepted = activeMentorship?.status === 'accepted';
                                            const isPending = activeMentorship?.status === 'pending' && activeMentorship.mentor._id === mentor._id;
                                            const isCompleted = !!completedMentorship; // True if ANY completed record exists

                                            // Rule 1: If completed AND NOT in profile (meaning not "learned again"), hide completely
                                            if (isCompleted && !isInProfile) return null;

                                            // Rule 2: If accepted (from any mentor), show "Learning in Progress"
                                            if (isAccepted) {
                                                return (
                                                    <button key={skill} className="btn btn-sm" style={{ background: 'rgba(2, 132, 199, 0.2)', color: '#7dd3fc', border: '1px solid rgba(125, 211, 252, 0.3)', cursor: 'default' }} disabled onClick={(e) => e.stopPropagation()}>
                                                        Learning {skill}
                                                    </button>
                                                );
                                            }

                                            // Rule 3: If pending, show "Request Sent"
                                            if (isPending) {
                                                return (
                                                    <button key={skill} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'default' }} disabled onClick={(e) => e.stopPropagation()}>
                                                        Request Sent
                                                    </button>
                                                );
                                            }

                                            // Rule 4: If completed AND in profile, show Request button (Explicit Learn Again case)
                                            if (isCompleted && isInProfile) {
                                                return (
                                                    <button
                                                        key={skill}
                                                        className="btn btn-sm btn-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRequest(mentor._id, skill);
                                                        }}
                                                    >
                                                        Request {skill}
                                                    </button>
                                                );
                                            }

                                            // Rule 5: If NOT in profile, show "Add to Profile" (disabled)
                                            if (!isInProfile) {
                                                return (
                                                    <button
                                                        key={skill}
                                                        className="btn btn-sm"
                                                        style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fcd34d', border: '1px solid rgba(251, 191, 36, 0.2)', cursor: 'not-allowed' }}
                                                        disabled
                                                        title="Add this skill to your profile to request"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {skill} (Add to Profile)
                                                    </button>
                                                );
                                            }

                                            // Default: Show Request button (only for skills in profile and not completed)
                                            return (
                                                <button
                                                    key={skill}
                                                    className="btn btn-sm btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRequest(mentor._id, skill);
                                                    }}
                                                >
                                                    Request {skill}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Three Column Grid: Quick Stats | Quick Actions | Completed */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Quick Stats Box */}
                    <div className="card-blue">
                        <h3 className="card-title">Quick Stats</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>{activeSkillsToLearn.length}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Skills to Learn</div>
                            </div>
                            <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{completedCourses.length}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Completed</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Box */}


                    {/* Completed Courses Box */}
                    <div className="card-green">
                        <h3 className="card-title">Completed Courses</h3>
                        {completedCourses.length === 0 ? (
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.1)' }}>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1rem 0' }}>No courses completed yet.</p>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                                    Select skills from your <a href="/profile" style={{ color: '#6366f1', textDecoration: 'underline' }}>Profile</a> to get started!
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div style={{ background: 'white', borderRadius: '0.5rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '0.75rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    {completedCourses.map(m => (
                                        <div key={m._id} style={{ padding: '0.75rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1e293b' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>✅ <strong>{m.skill}</strong></span>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                                                    Mentor: {m.mentor?.name || 'Unknown'}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-sm"
                                                style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                onClick={() => handleLearnAgain(m.skill)}
                                            >
                                                Learn Again
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#92400e', textAlign: 'center', border: '1px solid #fde68a' }}>
                                    Want more courses? <a href="/profile" style={{ color: '#92400e', fontWeight: 'bold', textDecoration: 'underline' }}>Update your profile</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Two Column Grid: Badges | Leaderboard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Badges Box */}
                    <div className="card-orange">
                        <h3 className="card-title">Badges</h3>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '2.5rem' }}>🏆</div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>0 Badges</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Complete courses to unlock!</div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Box */}
                    <div className="card-purple">
                        <h3 className="card-title">Leaderboard Position</h3>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#1e293b' }}>Your Rank: <strong>Calculating...</strong></div>
                            <div className="progress-bar" style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                <div className="progress-value" style={{ width: '15%', background: '#a855f7', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. My Learning Progress (Bottom Box) */}
                {activeMentorships.length > 0 && (
                    <div className="card-blue">
                        <h3 className="card-title">My Learning Progress</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {activeMentorships.map(m => (
                                <div key={m._id} style={{ background: 'white', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#1e293b' }}>
                                        <strong>{m.skill}</strong>
                                        <span className={`badge badge-${m.status}`}>{m.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>Mentor: {m.mentor?.name}</p>

                                    {m.status === 'pending' && (
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', width: '100%' }}
                                            onClick={() => handleCancelRequest(m._id, m.skill)}
                                        >
                                            Cancel Request
                                        </button>
                                    )}

                                    {m.status === 'accepted' && (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: '#64748b' }}>
                                                <span>Progress</span>
                                                <span>{m.progress}%</span>
                                            </div>
                                            <div className="progress-bar" style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                                                <div className="progress-value" style={{ width: `${m.progress}%`, background: '#6366f1', borderRadius: '3px' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mentor Details Modal */}
            {selectedMentor && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => setSelectedMentor(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            position: 'relative'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMentor(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '0.25rem'
                            }}
                        >
                            ×
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#3b82f6',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: 'bold'
                            }}>
                                {selectedMentor.name.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>{selectedMentor.name}</h2>
                                {selectedMentor.averageRating > 0 && (
                                    <div style={{ color: '#fbbf24', marginTop: '0.25rem' }}>★ {selectedMentor.averageRating.toFixed(1)} Rating</div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bio</h4>
                            <p style={{ margin: 0, color: '#334155', lineHeight: '1.6' }}>
                                {selectedMentor.bio || "No bio available for this mentor."}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                                <span>✉️</span>
                                <a href={`mailto:${selectedMentor.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedMentor.email}</a>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Teaches</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedMentor.skillsToTeach?.map(skill => (
                                    <span key={skill} style={{
                                        background: '#f1f5f9',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.85rem',
                                        color: '#475569'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setSelectedMentor(null)}
                                style={{ padding: '0.5rem 1.5rem' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
