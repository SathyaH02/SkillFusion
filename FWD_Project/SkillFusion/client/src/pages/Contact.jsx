import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <div className="landing-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            {/* Abstract Background Shapes Reuse */}
            <div className="shape shape-2" style={{ top: '10%', right: '10%' }}></div>
            <div className="shape shape-3" style={{ bottom: '10%', left: '5%' }}></div>

            <nav className="landing-nav" style={{ padding: '1.5rem 2rem' }}>
                <div className="landing-logo">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="logo-icon">⚡</span> SkillFusion
                    </Link>
                </div>
                <div className="landing-auth" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Home</Link>
                    <Link to="/login" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Login</Link>
                    <Link to="/signup" style={{
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        color: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        textDecoration: 'none',
                        fontWeight: '500',
                        boxShadow: '0 4px 10px rgba(168, 85, 247, 0.4)'
                    }}>Sign Up</Link>
                </div>
            </nav>

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 100px)' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', width: '100%' }}>

                    {/* Left: Info */}
                    <div>
                        <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textAlign: 'left', lineHeight: 1.1, background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Let's Talk.
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                            Have a question about mentoring? Want to partner with us? Or just want to say hi? We'd love to hear from you.
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Email Us</div>
                            <div style={{ color: '#a855f7', fontSize: '1.1rem' }}>support@skillfusion.com</div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Visit Us</div>
                            <div style={{ color: '#94a3b8', fontSize: '1.1rem' }}>123 Innovation Drive, Tech City, TC 90210</div>
                        </div>
                    </div>

                    {/* Right: Form (Visual) */}
                    <div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Name</label>
                            <input type="text" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.6)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} placeholder="John Doe" />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                            <input type="email" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.6)', color: 'white', outline: 'none' }} placeholder="john@example.com" />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Message</label>
                            <textarea rows="4" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.6)', color: 'white', outline: 'none', resize: 'none' }} placeholder="How can we help?"></textarea>
                        </div>
                        <button className="btn-cta" style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: '1rem', fontSize: '1rem' }}>
                            Send Message
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
