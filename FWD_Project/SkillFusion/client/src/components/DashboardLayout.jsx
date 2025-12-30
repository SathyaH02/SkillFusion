import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QUOTES = [
    "Every expert was once a beginner. — Helen Hayes",
    "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
    "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
    "Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi",
    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. — Brian Herbert",
    "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence. — Abigail Adams",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn. — Benjamin Franklin",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. — Dr. Seuss",
    "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young. — Henry Ford",
    "An investment in knowledge pays the best interest. — Benjamin Franklin",
    "The expert in anything was once a beginner. — Unknown",
    "Education is not preparation for life; education is life itself. — John Dewey",
    "Learning never exhausts the mind. — Leonardo da Vinci",
    "The only person who is educated is the one who has learned how to learn and change. — Carl Rogers",
    "Wisdom is not a product of schooling but of the lifelong attempt to acquire it. — Albert Einstein"
];

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    // Ensure no trailing slash
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Set random quote on mount
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

        if (user) fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(() => {
            if (user) fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notifications/` + user._id);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const handleRead = async (id) => {
        try {
            await fetch(`${API_URL}/api/notifications/` + id + '/read', { method: 'PUT' });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) { console.error(err); }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="dashboard-layout" style={{ minHeight: '100vh' }}>
            <header style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 50,
                background: '#1e293b', // Dark Blue Background
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white'
            }}>
                <div className="quote-container" style={{ color: '#f8fafc', fontStyle: 'italic', fontSize: '0.9375rem', fontWeight: '500', flex: 1, textAlign: 'center' }}>
                    "{quote}"
                </div>
                <div className="nav-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    {/* Notification Bell */}
                    <div style={{ position: 'relative', cursor: 'pointer', marginRight: '1.5rem', display: 'flex', alignItems: 'center' }} onClick={() => setShowNotifications(!showNotifications)}>
                        <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🔔</span>
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                padding: '2px 6px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                {unreadCount}
                            </span>
                        )}

                        {/* Notification Dropdown (Dark Mode) */}
                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                width: '320px',
                                background: 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: 'blur(10px)',
                                color: '#1e293b',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                                zIndex: 1000,
                                maxHeight: '400px',
                                overflowY: 'auto',
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                marginTop: '10px'
                            }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ padding: '1rem', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Notifications</span>
                                    <button onClick={(e) => { e.stopPropagation(); setShowNotifications(false) }} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                                </div>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No notifications</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n._id}
                                            style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: n.read ? 'transparent' : 'rgba(59, 130, 246, 0.1)', cursor: 'pointer', transition: 'background 0.2s' }}
                                            onClick={() => handleRead(n._id)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(59, 130, 246, 0.1)'}
                                        >
                                            <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{n.message}</div>
                                            {((n.type === 'completion') || (n.type === 'info' && n.message.includes('completed'))) && (
                                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                    {n.rated ? (
                                                        <>
                                                            <span style={{ fontSize: '0.8rem', marginRight: '0.5rem', color: '#94a3b8' }}>You rated:</span>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <span key={star} style={{ fontSize: '1rem', color: star <= n.ratingValue ? '#fbbf24' : '#475569' }}>★</span>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span style={{ fontSize: '0.8rem', marginRight: '0.5rem', color: '#cbd5e1' }}>Rate Mentor:</span>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <span key={star}
                                                                    style={{ cursor: 'pointer', fontSize: '1.2rem', color: '#fbbf24' }}
                                                                    title={`Rate ${star} stars`}
                                                                    onClick={async () => {
                                                                        if (window.confirm(`Rate this mentor ${star} stars?`)) {
                                                                            try {
                                                                                await fetch(`${API_URL}/api/rate-mentor`, {
                                                                                    method: 'POST',
                                                                                    headers: { 'Content-Type': 'application/json' },
                                                                                    body: JSON.stringify({ mentorshipId: n.relatedId, rating: star, notificationId: n._id })
                                                                                });
                                                                                alert('Rating submitted!');
                                                                                // Update local state immediately to reflect changes without reload
                                                                                setNotifications(prev => prev.map(notif =>
                                                                                    notif._id === n._id
                                                                                        ? { ...notif, rated: true, ratingValue: star }
                                                                                        : notif
                                                                                ));
                                                                            } catch (err) { console.error(err); }
                                                                        }
                                                                    }}
                                                                >★</span>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="main-content" style={{ position: 'relative', zIndex: 10, padding: '2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
            <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.85rem', position: 'relative', zIndex: 10 }}>
                © 2025 SkillFusion | All Rights Reserved
            </footer>
        </div>
    );
};

export default DashboardLayout;
