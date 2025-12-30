import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';

const MentorDashboard = () => {
    const { user } = useAuth();
    const [dashboardUser, setDashboardUser] = useState(user || {});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mentorDataRes, userDataRes] = await Promise.all([
                fetch(`http://localhost:5000/api/dashboard/mentor/${user._id}`),
                fetch(`http://localhost:5000/api/profile/${user._id}`)
            ]);

            const mentorData = await mentorDataRes.json();
            const userData = await userDataRes.json();

            setRequests(mentorData);
            // Updating a local user state or just using the returned data for stats would be ideal.
            // But for minimal impact, let's update a new state variable 'dashboardUser'
            setDashboardUser(userData);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAccept = async (mentorshipId) => {
        try {
            const res = await fetch('http://localhost:5000/api/accept', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentorshipId })
            });
            if (res.ok) fetchData();
        } catch (err) { console.error(err); }
    };

    const handleReject = async (mentorshipId) => {
        if (!window.confirm("Are you sure you want to reject this request?")) return;
        console.log("Rejecting:", mentorshipId);
        try {
            const res = await fetch('http://localhost:5000/api/reject', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentorshipId })
            });
            if (res.ok) fetchData();
        } catch (err) { console.error(err); }
    };

    const handleUpdateProgress = async (mentorshipId, newProgress) => {
        try {
            const res = await fetch('http://localhost:5000/api/progress', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentorshipId, progress: parseInt(newProgress) })
            });
            if (res.ok) fetchData();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div>Loading...</div>;

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const activeStudents = requests.filter(r => r.status === 'accepted');
    const completedStudents = requests.filter(r => r.status === 'completed');

    return (
        <DashboardLayout>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Quick Stats Card */}
                <div className="card-orange">
                    <h3 className="card-title">Quick Stats</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{dashboardUser.skillsToTeach?.length || 0}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Skills I Teach</div>
                        </div>
                        <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{activeStudents.length}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Active Students</div>
                        </div>
                        <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                                {dashboardUser.averageRating ? dashboardUser.averageRating.toFixed(1) : '-'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Rating</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                {/* Quick Actions Card */}
                <div className="card-blue">
                    <h3 className="card-title">Quick Actions</h3>
                    <div style={{ marginTop: '0.5rem' }}>
                        <button
                            className="btn"
                            style={{
                                background: 'white',
                                color: '#334155',
                                border: '1px solid #e2e8f0',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start', // Align to start
                                gap: '1rem', // More gap
                                padding: '0.75rem 1rem', // More padding
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f8fafc';
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={() => {
                                const skill = prompt("Enter skill name for certificate:");
                                if (skill) {
                                    alert(`Certificate for ${skill} uploaded! (Mock)`);
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>📂</span>
                            <span style={{ fontWeight: '500' }}>Upload Certificate</span>
                        </button>
                    </div>
                </div>

                {/* Skills I Can Teach */}
                <div className="card-blue">
                    <h3 className="card-title">Skills I Can Teach</h3>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
                        {user.skillsToTeach && user.skillsToTeach.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {user.skillsToTeach.map(skill => (
                                    <span key={skill} style={{ background: '#f0f9ff', color: 'var(--primary-dark)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', border: '1px solid #bae6fd' }}>{skill}</span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No teaching skills listed.</p>
                        )}
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="card-blue" style={{ gridColumn: 'span 2' }}>
                    <h3 className="card-title">Pending Requests</h3>
                    {pendingRequests.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'white', borderRadius: '0.5rem', color: '#64748b', marginTop: '0.5rem' }}>
                            No pending requests.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {pendingRequests.map(r => (
                                <div key={r._id} style={{ padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #fee2e2', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{r.student?.name}</div>
                                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#4b5563' }}>Wants to learn: <strong style={{ color: 'var(--primary-dark)' }}>{r.skill}</strong></p>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                        <button onClick={() => handleAccept(r._id)} className="btn btn-sm btn-primary" style={{ flex: 1 }}>Accept</button>
                                        <button onClick={() => handleReject(r._id)} className="btn btn-sm" style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', flex: 1 }}>Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Students */}
                <div className="card-green" style={{ gridColumn: '1 / -1' }}>
                    <h3 className="card-title">My Students (Active)</h3>
                    {activeStudents.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'white', borderRadius: '0.5rem', color: '#64748b', marginTop: '0.5rem' }}>
                            No active students.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {activeStudents.map(r => (
                                <div key={r._id} style={{ background: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid #e2e8f0' }}>
                                    <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>{r.student?.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Learning: <strong style={{ color: 'var(--primary-color)' }}>{r.skill}</strong></p>
                                    <div style={{ marginTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                            <span>Progress</span>
                                            <span>{r.progress}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-value" style={{ width: `${r.progress}%` }}></div>
                                        </div>

                                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                defaultValue={r.progress}
                                                className="form-control"
                                                style={{ width: '80px', padding: '0.25rem' }}
                                                id={`progress-${r._id}`}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    const input = document.getElementById(`progress-${r._id}`);
                                                    handleUpdateProgress(r._id, input.value);
                                                }}
                                                className="btn btn-sm btn-outline-primary"
                                                style={{ marginLeft: '0.5rem' }}
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed */}
                <div className="card-purple" style={{ gridColumn: 'span 3' }}>
                    <h3 className="card-title">Completed Mentorships</h3>
                    {completedStudents.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'white', borderRadius: '0.5rem', color: '#64748b', marginTop: '0.5rem' }}>
                            No completed mentorships yet.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            {completedStudents.map(r => (
                                <div key={r._id} style={{ background: 'white', padding: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{r.student?.name}</div>
                                        {r.rating ? (
                                            <div style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 'bold' }}>★ {r.rating}</div>
                                        ) : (
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Not rated</div>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Learned: <strong style={{ color: 'var(--primary-color)' }}>{r.skill}</strong></p>
                                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                        <span className="badge badge-completed" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Finished</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MentorDashboard;
