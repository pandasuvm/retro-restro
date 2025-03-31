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
          <div className="retro-hero-tagline">A BLAST FROM THE PAST </div>
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
    <h2 className="retro-section-title">RETRO SPECIALS</h2>
    <div className="retro-section-underline"></div>
  </div>
  
  <div className="retro-featured-grid">
    <div className="retro-featured-item">
      <div className="retro-featured-image" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}></div>
      <div className="retro-featured-content">
        <h3>ARCADE NIGHT</h3>
        <p>Every Thursday, enjoy free play on our vintage arcade machines with any purchase</p>
        <div className="retro-price">FREE PLAY</div>
      </div>
    </div>
    
    <div className="retro-featured-item">
      <div className="retro-featured-image" style={{
        backgroundImage: "url('https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}></div>
      <div className="retro-featured-content">
        <h3>VINYL WEEKENDS</h3>
        <p>Bring your favorite vinyl record and we'll play it while you dine</p>
        <div className="retro-price">SAT-SUN</div>
      </div>
    </div>
    
    <div className="retro-featured-item">
      <div className="retro-featured-image" style={{
        backgroundImage: "url('https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}></div>
      <div className="retro-featured-content">
        <h3>NEON HAPPY HOUR</h3>
        <p>Half-price milkshakes and appetizers from 4-6pm daily</p>
        <div className="retro-price">50% OFF</div>
      </div>
    </div>
  </div>
  
  <div className="retro-view-more">
    <Link to="/menu" className="retro-button retro-secondary-button">
      VIEW MENU OF THE NIGHT
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
        {/* <img 
          src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fdigital-geography.com%2Fshort-announce-google-maps-the-treasure-map%2F&psig=AOvVaw3hHRbVn98cMUSLUMiohMid&ust=1743460542968000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCV4OfusowDFQAAAAAdAAAAABAE" 
          alt="Vintage Map" 
          className="retro-map-image"
        /> */}
        <div className="retro-map-overlay">
          <div className="retro-map-pin"></div>
          <span className="retro-map-text">YOU ARE HERE</span>
        </div>
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
