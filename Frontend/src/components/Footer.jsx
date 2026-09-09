import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-logo">
            <i className="fa-solid fa-location-dot" />
            <span>LocalServices</span>
          </div>
          <p>
            Connecting you with trusted local professionals for plumbing, cleaning,
            electrical, beauty, and more — all in one place.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
            <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/providers">Providers</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-links">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services?category=HOME">Home Repair</Link></li>
            <li><Link to="/services?category=CLEANING">Cleaning</Link></li>
            <li><Link to="/services?category=BEAUTY">Beauty</Link></li>
            <li><Link to="/services?category=REPAIR">Electrical</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><i className="fa-solid fa-envelope" /> support@localservices.com</p>
          <p><i className="fa-solid fa-phone" /> +91 98765 00000</p>
          <p><i className="fa-solid fa-clock" /> Mon – Sat, 8am – 8pm</p>
          <p><i className="fa-solid fa-location-dot" /> Chennai, Tamil Nadu, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LocalServices Connect. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
