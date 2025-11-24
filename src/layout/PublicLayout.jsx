import React, { useState, useEffect } from "react";
 import "./layout.css"; // Assuming CSS is loaded globally

// Custom Dark Mode Hook
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    // Check before accessing localStorage
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    }
    return false; // Default to light if not in browser
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
  }, [dark]);

  return [dark, setDark];
};

// Breadcrumb Component
const Breadcrumbs = () => {
  // Get the current path
  const currentPath = typeof window !== 'undefined' ? window.location.pathname.substring(1) : 'home';
  const path = currentPath === "" ? "Home" : currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  return (
    <div className="breadcrumbs">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <span className="text-gray-500 dark:text-gray-400">Home / </span>
        <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">
          {path.replace(/-/g, " ")}
        </span>
      </div>
    </div>
  );
};

// Main Component
export default function PublicLayout({ children, showHero = true }) {
  const [dark, setDark] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToTopVisible, setIsToTopVisible] = useState(false);

  // Show "Back to Top" button on scroll
  useEffect(() => {
    const scrollHandler = () => {
      setIsToTopVisible(window.scrollY > 250);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CSS injected for the Hero Slider animation timing
  const sliderStyles = `
      @keyframes heroSlide {
        0% { opacity: 0; transform: scale(1.12); }
        10% { opacity: 1; transform: scale(1.04); }
        25% { opacity: 1; transform: scale(1.00); }
        35% { opacity: 0; transform: scale(1.07); }
        100% { opacity: 0; }
      }
      /* Custom class names ensuring timing matches CSS structure */
      .hero-slide:nth-child(1) { animation-delay: 0s; }
      .hero-slide:nth-child(2) { animation-delay: 6s; }
      .hero-slide:nth-child(3) { animation-delay: 12s; }
      .hero-slide:nth-child(4) { animation-delay: 18s; }
  `;

  // Navigation Content - MOBILE/DRAWER ONLY
  const MobileNavContent = (
    <nav className="flex flex-col lg:hidden w-full space-y-1">
      <a href="/" className="nav-link">Home</a>
      <a href="/products" className="nav-link">Our Products</a>

      {/* DROPDOWN - Company (Mobile) */}
   <div className="w-full">
  <button
    onClick={() => setOpen(!open)}
    className="dropdown-toggle text-left w-full flex justify-between items-center"
  >
    Company <span className="ml-1">▾</span>
  </button>

  {open && (
    <div className="dropdown-mobile">
      <a href="/about" className="dropdown-mobile-item block px-4 py-2">About Us</a>
      <a href="/gallery" className="dropdown-mobile-item block px-4 py-2">Gallery</a>
      <a href="/certifications" className="dropdown-mobile-item block px-4 py-2">Certificates & Quality</a>
      <a href="/careers" className="dropdown-mobile-item block px-4 py-2">Careers</a>
    </div>
  )}
</div>




      <a href="/contact" className="nav-link">Contact Us</a>
      <a href="/blog" className="nav-link">Insights</a>
    </nav>
  );
  
  // Navigation Content - DESKTOP ONLY
  const DesktopNavContent = (
    <nav className="desktop-nav-links"> {/* Class for CSS targeting */}
      <a href="/" className="nav-link">Home</a>
      <a href="/products" className="nav-link">Our Products</a>

      {/* DROPDOWN - Company (Desktop) */}
      <div className="relative group">
        <button className="dropdown-toggle">
          Company <span className="ml-1">▾</span>
        </button>

        {/* Desktop Dropdown Menu */}
        <div className="dropdown-menu">
          <a href="/about" className="dropdown-item">About Us</a>
          <a href="/gallery" className="dropdown-item">Gallery</a>
          <a href="/certifications" className="dropdown-item">Certificates & Quality</a>
          <a href="/careers" className="dropdown-item">Careers</a>
        </div>
      </div>

      <a href="/contact" className="nav-link">Contact Us</a>
      <a href="/blog" className="nav-link">Insights</a>
    </nav>
  );


  return (
    <div className="font-inter min-h-screen flex flex-col antialiased">

      {/* Inject Slider Animation styles */}
      <style>{sliderStyles}</style>

      {/* Announcement Bar */}
      <div className="announcement">
        🎉 Big News! New version of Company Manager launches next week!
        <a href="/updates" className="announcement-link"> Learn more →</a>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="header-container">

          {/* 1. LEFT: Logo Area (CSS Grid Column 1) */}
          <div className="header-left">
            <img
              // Logo color changed to primary blue for better contrast on transparent background
              src="https://placehold.co/100x100/3b82f6/ffffff?text=LM"
              className="logo-img"
              alt="Laxmi Jee Mini Rice Mill Logo"
            />
            <div className="hidden sm:block">
              <span className="logo-title">LAXMI JEE</span>
              <small className="logo-subtitle">Premium Quality Rice</small>
            </div>
          </div>
          
          {/* 2. CENTER: Desktop Navigation (CSS Grid Column 2) */}
          <div className="header-center hidden lg:flex">
              {DesktopNavContent}
          </div>

          {/* 3. RIGHT: Utilities and CTA (CSS Grid Column 3) */}
          <div className="header-right-group"> 
            
            {/* Icons and Utils */}
            <div className="header-right-icons hidden lg:flex items-center space-x-3">
              <div className="icon">🔔</div>

              <button
                className="theme-toggle"
                onClick={() => setDark(!dark)}
              >
                {dark ? "🌙" : "☀️"}
              </button>
            </div>
            
            {/* CTA Buttons (Rightmost) */}
            <div className="hidden lg:flex items-center space-x-3">
              <a className="btn-primary" href="/request-quote">Request A Quote</a>
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              ☰
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer and Backdrop */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
          &times;
        </button>

        <div className="mobile-nav-content">
          {MobileNavContent}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <a className="btn-primary w-full text-center" href="/request-quote">
              Request A Quote
            </a>
            <a className="btn-outline w-full text-center" href="/login">
              Wholesaler Login
            </a>
          </div>
        </div>

        <button
          className="mobile-theme-toggle"
          onClick={() => { setDark(!dark); setIsMobileMenuOpen(false); }}
        >
          {dark ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}


      {/* HERO SECTION */}
      {showHero && (
        <section className="hero-section">

          {/* Background Slider */}
          <div className="hero-slider">

            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550989460-0adf9ea00c9e?auto=format&fit=crop&w=1920&q=80')" }}></div>
            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585202900225-6d3ac20a6962?auto=format&fit=crop&w=1920&q=80')" }}></div>
            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601000938259-9ce0c6f5e195?auto=format&fit=crop&w=1920&q=80')" }}></div>
            <div className="hero-slide" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1608574955444-9e0c2f651ef9?auto=format&fit=crop&w=1920&q=80')" }}></div>

          </div>

          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span>LAXMI JEE MINI RICE MILL</span>
            </h1>

            <p className="hero-subtitle">
              Delivering premium quality rice with purity, trust, and the highest processing standards.
              Serving farmers, wholesalers, and families across the nation.
            </p>

            <div className="hero-buttons">
              <a href="/products" className="hero-btn-primary">Our Products</a>
              <a href="/request-quote" className="hero-btn-blue">Request A Quote</a>
              <a href="/contact" className="hero-btn-outline">Contact Sales</a>
            </div>
          </div>

        </section>
      )}



      {/* Loading Bar (Placeholder) */}
      <div className="h-1 bg-blue-500 w-0 transition-all"></div>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Content */}
      <main className="main-area">
        <div className="main-container">{children}</div>
      </main>

      {/* Back to Top Button */}
      <button
        className={`to-top-btn-fixed ${isToTopVisible ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">

          {/* Brand Column */}
          <div>
            <img
              src="https://placehold.co/100x100/0f172a/ffffff?text=LM"
              className="footer-logo"
              alt="Logo"
            />
            <h3 className="footer-title">LAXMI JEE MINI RICE MILL</h3>
            <p className="footer-text">Premium rice processing and milling with trusted quality.</p>

            {/* Social Icons */}
            <div className="footer-social">
              <a href="#" aria-label="Website">🌐</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="YouTube">▶️</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
            <p className="footer-india">🇮🇳 Made in India</p>
          </div>

          
          {/* Products */}
          <div>
            <h4 className="footer-heading">Our Products</h4>
            <a href="/products/basmati">Premium Basmati Rice</a>
            <a href="/products/sona-masoori">Sona Masoori Rice</a>
            <a href="/products/raw">Raw Rice</a>
            <a href="/products/steam">Steam Rice</a>
            <a href="/products/broken">Broken Rice (B-Grade)</a>
            <a href="/services/bran">Rice Bran Supply</a>
            <a href="/services/paddy-cleaning">Paddy Cleaning Services</a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact Information</h4>
            <p className="footer-text">
              📍 <strong>Factory Address:</strong><br />
              Laxmi Jee Mini Rice Mill, NH-XYZ Road,<br />
              Village, District, State – PINCODE
            </p>
            <p>📞 <a href="tel:+918000000000" className="footer-phone">+91 80000 00000</a></p>
            <p>📧 <a href="mailto:info@laxmijeericemill.com" className="footer-email">info@laxmijeericemill.com</a></p>
            <a href="https://maps.google.com" target="_blank" className="footer-map">📍 View on Google Maps</a>
          </div>

          {/* Customer Portal */}
          <div>
            <h4 className="footer-heading">Customer Center</h4>
            <a href="/login">Wholesaler Login</a>
            <a href="/track-order">Track My Order</a>
            <a href="/distributor">Distributor Inquiry</a>
            <a href="/partnerships">Farmer Partnership</a>

            <h4 className="footer-heading mt-4">Legal & Quality</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/quality">Quality Assurance Policy</a>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-heading">Business Hours</h4>
            <p className="footer-text-small">Mon – Sat: 9:00 AM – 7:00 PM</p>
            <p className="footer-text-small mb-4">Sunday: Closed</p>

            <h4 className="footer-heading mt-4">Newsletter</h4>
            <input type="email" className="footer-input" placeholder="Enter email" />
            <button className="footer-btn">Subscribe</button>
          </div>
          
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} LAXMI JEE MINI RICE MILL — All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}
