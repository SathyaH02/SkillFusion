import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Parse query param
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (!token) {
            setError("Invalid or missing token");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid #334155',
        color: 'white',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#cbd5e1',
        fontSize: '0.9rem'
    };

    const groupStyle = {
        marginBottom: '1.5rem'
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="alert alert-danger" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', padding: '1rem', borderRadius: '0.5rem' }}>Invalid Reset Link (No Token Found)</div>
            </div>
        );
    }

    return (
        <div className="landing-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Abstract Background Shapes */}
            <div className="shape shape-2" style={{ top: '10%', left: '-5%' }}></div>
            <div className="shape shape-3" style={{ bottom: '10%', right: '-5%' }}></div>

            <div className="login-form-card" style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '2.5rem',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#f1f5f9' }}>Reset Password</h2>

                {message && <div className="alert alert-success" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'none', marginBottom: '1.5rem' }}>{message}</div>}
                {error && <div className="alert alert-danger" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={groupStyle}>
                        <label style={labelStyle}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                            style={inputStyle}
                        />
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' }}>
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
