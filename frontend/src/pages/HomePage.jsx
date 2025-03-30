// pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RetroHomePage.css';



const HomePage = () => {
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showIntro) {
    return (
      <div className="retro-intro">
        <div className="retro-intro-content">
          <div className="retro-logo-flicker">RETRO DINER</div>
          <div className="retro-intro-tagline">LOADING AWESOME FOOD...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="retro-home-container">
      <div className="retro-brick-overlay"></div>
      
      {/* Hero Section */}
      <section className="retro-hero">
        <div className="retro-hero-content">
          <h1 className="retro-hero-title">RETRO DINER</h1>
          <div className="retro-hero-tagline">A BLAST FROM THE PAST</div>
          <p className="retro-hero-description">
            Experience the nostalgic flavors of the 80s and 90s in our totally radical restaurant
          </p>
          <div className="retro-hero-buttons">
            <Link to="/table-selection" className="retro-button retro-primary-button">
              SELECT TABLE
            </Link>
          </div>
        </div>
        <div className="retro-hero-neon">
          <div className="retro-neon-sign"></div>
        </div>
      </section>
      
      {/* Featured Items */}
      <section className="retro-featured">
        <div className="retro-section-header">
          <h2 className="retro-section-title">FEATURED EATS</h2>
          <div className="retro-section-underline"></div>
        </div>
        
        <div className="retro-featured-grid">
          <div className="retro-featured-item">
            <div className="retro-featured-image burger-neon"></div>
            <div className="retro-featured-content">
              <h3>CLASSIC BURGER</h3>
              <p>Juicy beef patty with lettuce, tomato, and our special sauce</p>
              <div className="retro-price">$8.99</div>
            </div>
          </div>
          
          <div className="retro-featured-item">
            <div className="retro-featured-image fries-neon"></div>
            <div className="retro-featured-content">
              <h3>CHEESE FRIES</h3>
              <p>Crispy fries topped with melted cheese and bacon bits</p>
              <div className="retro-price">$4.99</div>
            </div>
          </div>
          
          <div className="retro-featured-item">
            <div className="retro-featured-image shake-neon"></div>
            <div className="retro-featured-content">
              <h3>CHOCOLATE SHAKE</h3>
              <p>Creamy chocolate milkshake topped with whipped cream</p>
              <div className="retro-price">$3.99</div>
            </div>
          </div>
        </div>
        
        <div className="retro-view-more">
          <Link to="/menu" className="retro-button retro-secondary-button">
            VIEW FULL MENU
          </Link>
        </div>
      </section>
      
      {/* About Section */}
      <section className="retro-about">
        <div className="retro-about-grid">
          <div className="retro-about-content">
            <h2 className="retro-section-title">OUR STORY</h2>
            <div className="retro-section-underline"></div>
            <p>
              Retro Diner was founded with a simple mission: to bring back the nostalgic flavors and atmosphere of the 80s and 90s diners that we all loved.
            </p>
            <p>
              Our restaurant combines classic American comfort food with a retro aesthetic that will transport you back in time. From neon lights to vintage arcade games, we've created an immersive experience that celebrates the golden era of diners.
            </p>
          </div>
          <div className="retro-about-image">
            <div className="retro-polaroid">
              <div className="retro-polaroid-image"></div>
              <div className="retro-polaroid-caption">EST. 2020</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hours & Location */}
      <section className="retro-info">
        <div className="retro-info-grid">
          <div className="retro-hours">
            <h2 className="retro-section-title">HOURS</h2>
            <div className="retro-section-underline"></div>
            <ul className="retro-hours-list">
              <li>
                <span>MONDAY - FRIDAY</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
              <li>
                <span>SATURDAY</span>
                <span>10:00 AM - 11:00 PM</span>
              </li>
              <li>
                <span>SUNDAY</span>
                <span>10:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
          
          <div className="retro-location">
            <h2 className="retro-section-title">FIND US</h2>
            <div className="retro-section-underline"></div>
            <div className="retro-address">
              <p>123 RETRO STREET</p>
              <p>NOSTALGIA CITY, NC 28801</p>
              <p>PHONE: (555) 123-4567</p>
            </div>
            <div className="retro-map">
              <div className="retro-map-placeholder"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="retro-footer">
        <div className="retro-footer-content">
          <div className="retro-footer-logo">RETRO DINER</div>
          <div className="retro-footer-tagline">WHERE THE 80s & 90s LIVE FOREVER</div>
          <div className="retro-footer-copyright">© 2023 RETRO DINER. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
