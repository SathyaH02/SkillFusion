import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import collageBg from '../assets/collage_background.jpg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="landing-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', position: 'relative' }}>
            <Link to="/" style={{ position: 'absolute', top: '2rem', right: '4rem', color: 'white', textDecoration: 'none', fontWeight: '500', zIndex: 20, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2rem', backdropFilter: 'blur(5px)' }}>
                ← Home
            </Link>
            {/* Abstract Background Shapes */}
            <div className="shape shape-1" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="shape shape-2" style={{ bottom: '10%', right: '-5%' }}></div>
            <div className="shape shape-3" style={{ top: '40%', right: '20%' }}></div>

            <div className="login-card" style={{
                display: 'flex',
                maxWidth: '1100px',
                width: '100%',
                background: 'transparent',
                borderRadius: '1rem',
                overflow: 'hidden',
                minHeight: '650px',
                zIndex: 10
            }}>
                {/* Visual Side (Left) - Opaque Image */}
                <div className="login-visual" style={{ width: '55%', position: 'relative', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={collageBg}
                        alt="SkillFusion Community"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <div className="visual-overlay" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '1.5rem',
                        borderRadius: '50%',
                        width: '240px',
                        height: '240px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                    }}>
                        <p className="visual-text" style={{ color: '#1e293b', fontSize: '0.9rem', lineHeight: '1.5', margin: 0, fontFamily: '"Handlee", cursive' }}>
                            "Empowering people to connect, share, and grow — transforming every skill into a step toward success."
                        </p>
                    </div>
                </div>

                {/* Form Side (Right) - Transparent with Dark Theme */}
                <div className="login-form-section" style={{ width: '45%', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none' }}>
                    <div className="login-content" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                        <div className="login-brand" style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                            <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                ⚡ SkillFusion
                            </span>
                        </div>

                        <p className="login-welcome" style={{ color: '#cbd5e1', marginBottom: '2rem', textAlign: 'center' }}>
                            Hey there, welcome back! Let's get you <br /> logged in.
                        </p>

                        {error && <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(248,113,113,0.1)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white' }}
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', color: 'white' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>

                            <button type="submit" className="login-btn" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'white', color: '#0f172a', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                Login
                            </button>
                        </form>

                        <Link to="/forgot-password" className="forgot-password" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Forgot your password?
                        </Link>

                        <div className="signup-link" style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8' }}>
                            New here? <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Join SkillFusion</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
