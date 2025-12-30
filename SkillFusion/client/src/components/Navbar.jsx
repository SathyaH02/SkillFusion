import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">SkillFusion</div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
                {user ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                            <Link to="/leaderboard" style={{ textDecoration: 'none', marginRight: '1.5rem', fontSize: '1.5rem' }} title="Leaderboard">🏆</Link>
                            <Link to="/profile" style={{ textDecoration: 'none', marginRight: '0.75rem', display: 'flex', alignItems: 'center' }} title="Go to Profile">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '2px solid rgba(99, 102, 241, 0.3)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {!user.avatar && user.name.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                            <span className="user-welcome">Hello, {user.name} ({user.role})</span>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
