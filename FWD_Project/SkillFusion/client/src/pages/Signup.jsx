import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [usernameStatus, setUsernameStatus] = useState(''); // 'checking', 'available', 'taken', 'invalid'
    const [usernameMessage, setUsernameMessage] = useState('');
    const { signup, checkUsernameAvailability } = useAuth();
    const navigate = useNavigate();

    const validateUsername = (username) => {
        if (username.length < 3) return 'Username must be at least 3 characters';
        if (username.length > 20) return 'Username must be at most 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
        return null;
    };

    const handleUsernameChange = async (e) => {
        const username = e.target.value;
        setFormData({ ...formData, username });

        if (!username) {
            setUsernameStatus('');
            setUsernameMessage('');
            return;
        }

        const validationError = validateUsername(username);
        if (validationError) {
            setUsernameStatus('invalid');
            setUsernameMessage(validationError);
            return;
        }

        setUsernameStatus('checking');
        setUsernameMessage('Checking availability...');

        const result = await checkUsernameAvailability(username);

        // Handle the new object response or fallback for old boolean response
        const available = typeof result === 'object' ? result.available : result;
        const errorMessage = typeof result === 'object' ? result.error : null;

        if (available) {
            setUsernameStatus('available');
            setUsernameMessage('✓ Username is available');
        } else {
            setUsernameStatus('taken');
            // If we have a specific error (like Network Error), show that. Otherwise default to "taken".
            setUsernameMessage(errorMessage ? `Error: ${errorMessage}` : 'Username is already taken');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Final validation check
        if (usernameStatus !== 'available') {
            setError('Please choose a valid and available username');
            return;
        }

        const data = { ...formData };
        const success = await signup(data);
        if (success) {
            navigate('/profile');
        } else {
            setError('Signup failed. Please try again.');
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
        <div className="landing-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem', position: 'relative' }}>
            <Link to="/" style={{ position: 'absolute', top: '2rem', right: '4rem', color: 'white', textDecoration: 'none', fontWeight: '500', zIndex: 20, padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2rem', backdropFilter: 'blur(5px)' }}>
                ← Home
            </Link>
            {/* Abstract Background Shapes */}
            <div className="shape shape-1" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="shape shape-2" style={{ bottom: '10%', right: '-5%' }}></div>
            <div className="shape shape-3" style={{ top: '40%', right: '20%' }}></div>

            <div className="form-container" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                maxWidth: '450px',
                width: '100%',
                borderRadius: '1rem',
                padding: '2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ⚡ SkillFusion
                        </span>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f1f5f9' }}>Create an Account</h2>
                </div>

                {error && <div style={{ color: '#f87171', marginBottom: '1.5rem', background: 'rgba(248,113,113,0.1)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="John Doe"
                        />
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleUsernameChange}
                            required
                            style={{
                                ...inputStyle,
                                borderColor: usernameStatus === 'available' ? '#10b981' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? '#ef4444' : '#334155'
                            }}
                            placeholder="johndoe_student"
                        />
                        {usernameMessage && (
                            <div style={{
                                fontSize: '0.85rem',
                                marginTop: '0.5rem',
                                color: usernameStatus === 'available' ? '#10b981' : usernameStatus === 'taken' || usernameStatus === 'invalid' ? '#ef4444' : '#94a3b8'
                            }}>
                                {usernameMessage}
                            </div>
                        )}
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="name@company.com"
                        />
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="••••••••"
                        />
                    </div>
                    <div style={groupStyle}>
                        <label style={labelStyle}>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="student" style={{ color: 'black' }}>Student</option>
                            <option value="mentor" style={{ color: 'black' }}>Mentor</option>
                        </select>
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: '1rem',
                        background: 'white',
                        color: '#0f172a',
                        fontWeight: 'bold',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}>
                        Sign Up
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'white', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
