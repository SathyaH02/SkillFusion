import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await fetch('http://localhost:5000/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                // In a real app, we wouldn't show the token. 
                // But for this simulation requested by the user ("figure out whichever is easy"),
                // we will redirect them closely or show the token.
                setMessage(`Email sent! (Simulated)`);
                // Auto-redirect for convenience in this demo
                if (data.token) {
                    // small delay to let them read "Email sent"
                    setTimeout(() => {
                        navigate(`/reset-password?token=${data.token}`);
                    }, 1500);
                }
            } else {
                setError(data.message || 'Failed to send reset link');
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

    return (
        <div className="landing-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Abstract Background Shapes */}
            <div className="shape shape-1" style={{ top: '-10%', left: '-10%' }}></div>
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
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span className="logo-icon" style={{ fontSize: '2rem' }}>⚡</span>
                </div>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#f1f5f9' }}>Forgot Password</h2>
                <p style={{ textAlign: 'center', color: '#cbd5e1', marginBottom: '2rem', fontSize: '0.95rem' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && <div className="alert alert-success" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: 'none', marginBottom: '1.5rem' }}>{message}</div>}
                {error && <div className="alert alert-danger" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'none', marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            style={inputStyle}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#0f172a', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' }}>
                        Send Reset Link
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
