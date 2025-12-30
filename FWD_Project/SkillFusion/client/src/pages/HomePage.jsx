import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <span className="logo-icon">⚡</span> SkillFusion
                </div>
                <div className="landing-links">
                    <a href="#about">About</a>
                    <Link to="/terms">Terms & Conditions</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
                <div className="landing-auth">
                    <Link to="/login" className="btn-login-main">Log in</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">

                {/* Abstract Shapes (CSS based to emulate 3D vibe) */}
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Connect. Learn. <br />
                        <span className="text-gradient">Fuse Your Skills.</span>
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate platform to bridge the gap between learning and teaching. <br /> Find your mentor, master your craft, and share your expertise.
                    </p>
                    <Link to="/signup" className="btn-cta">
                        Get Started <span className="arrow">→</span>
                    </Link>
                </div>
            </header>

            {/* Footer / Info Sections (Placeholders) */}
            <section id="about" style={{ padding: '4rem 2rem', color: 'white', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <h3>About SkillFusion</h3>
                <p style={{ maxWidth: '600px', margin: '1rem auto', color: '#94a3b8' }}>
                    SkillFusion is a platform connecting learners and mentors to exchange knowledge, track progress, and build a portfolio of mastered skills.
                </p>
            </section>
        </div>
    );
};

export default HomePage;
