import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Skapa denna CSS-fil för att anpassa stilen

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/auth');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <img src="/path/to/logo.png" alt="Sunflower Clone Logo" className="logo" />
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#team">Team</a>
          <a href="#play" className="cta-button" onClick={handlePlayClick}>Play Now</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Sunflower Clone</h1>
          <p>Grow, build, and explore in this engaging 2D farming world.</p>
          <button className="play-button" onClick={handlePlayClick}>Play Now</button>
        </div>
        <img src="/path/to/hero-image.png" alt="Hero" className="hero-image" />
      </section>

      <section id="features" className="features">
        <h2>Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <img src="/path/to/feature1.png" alt="Feature 1" />
            <h3>Farm Crops</h3>
            <p>Plant seeds and harvest crops to earn resources.</p>
          </div>
          <div className="feature-item">
            <img src="/path/to/feature2.png" alt="Feature 2" />
            <h3>Build Structures</h3>
            <p>Construct buildings to expand your farm and capabilities.</p>
          </div>
          <div className="feature-item">
            <img src="/path/to/feature3.png" alt="Feature 3" />
            <h3>Explore the World</h3>
            <p>Venture out and discover new areas and adventures.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Sunflower Clone. All rights reserved.</p>
        <div className="social-links">
          <a href="https://twitter.com">Twitter</a>
          <a href="https://discord.com">Discord</a>
          <a href="https://github.com">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
