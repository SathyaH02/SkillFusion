import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="landing-page" style={{ position: 'relative', height: '100%', overflowY: 'auto' }}>
            {/* Abstract Background Shapes Reuse */}
            <div className="shape shape-1" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="shape shape-3" style={{ bottom: '10%', right: '-5%' }}></div>

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

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
                <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms and Conditions</h1>

                <div style={{ padding: '0 1rem' }}>
                    <h3 style={{ color: '#e2e8f0', marginTop: 0, fontSize: '1.5rem', marginBottom: '1rem' }}>1. Introduction</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Welcome to SkillFusion. By accessing our website, you match our mission to connect learners and mentors worldwide. These terms outline the rules and regulations for the use of SkillFusion's Website.
                    </p>

                    <h3 style={{ color: '#e2e8f0', marginTop: '2.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Intellectual Property Rights</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Other than the content you own, under these Terms, SkillFusion and/or its licensors own all the intellectual property rights and materials contained in this Website.
                    </p>

                    <h3 style={{ color: '#e2e8f0', marginTop: '2.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Restrictions</h3>
                    <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2rem' }}>
                        You are specifically restricted from all of the following:
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', listStyleType: 'circle' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Publishing any Website material in any other media;</li>
                            <li style={{ marginBottom: '0.5rem' }}>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                            <li>Using this Website in any way that is or may be damaging to this Website;</li>
                        </ul>
                    </div>

                    <h3 style={{ color: '#e2e8f0', marginTop: '2.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Your Content</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant SkillFusion a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                    </p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b' }}>
                    &copy; 2025 SkillFusion. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Terms;
