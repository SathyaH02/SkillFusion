import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

const Leaderboard = () => {
    // Ensure no trailing slash
    const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const res = await fetch(`${API_URL}/api/leaderboard`);
            const data = await res.json();
            setLeaders(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b', fontWeight: '700' }}>🏆 Leaderboard</h2>

                {loading ? (
                    <p>Loading leaderboard...</p>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Rank</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: '600' }}>XP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.map((user, index) => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: index < 3 ? '#eab308' : '#64748b' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                            }}>
                                                {/* Simple avatar placeholder logic based on avatar string or name initials */}
                                                {user.avatar && user.avatar.startsWith('http') ? (
                                                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                                ) : (
                                                    <span>{user.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '500', color: '#334155' }}>{user.name}</span>
                                                {user.badges && user.badges.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                        {user.badges.slice(0, 3).map((b, i) => (
                                                            <span key={i} title={b.name} style={{ fontSize: '0.8rem', cursor: 'help' }}>{b.icon}</span>
                                                        ))}
                                                        {user.badges.length > 3 && (
                                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: '2px' }}>+{user.badges.length - 3}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textTransform: 'capitalize', color: '#64748b' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem',
                                                background: user.role === 'mentor' ? '#dbeafe' : '#dcfce7',
                                                color: user.role === 'mentor' ? '#1e40af' : '#166534'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#3b82f6' }}>
                                            {user.xp.toLocaleString()} XP
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leaders.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users found on the leaderboard yet.</div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Leaderboard;
