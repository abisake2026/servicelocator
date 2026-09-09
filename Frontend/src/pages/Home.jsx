import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { servicesAPI, providersAPI } from '../utils/api';

const CATEGORIES = [
  { icon: 'fa-faucet',   label: 'Plumbing',        value: 'HOME',     color: '#2563eb', bg: '#dbeafe', desc: 'Leak fixes & pipe work'      },
  { icon: 'fa-bolt',     label: 'Electrical',       value: 'REPAIR',   color: '#d97706', bg: '#fef3c7', desc: 'Wiring & lighting'           },
  { icon: 'fa-broom',    label: 'Cleaning',         value: 'CLEANING', color: '#16a34a', bg: '#dcfce7', desc: 'Deep clean & maintenance'    },
  { icon: 'fa-scissors', label: 'Beauty',           value: 'BEAUTY',   color: '#9333ea', bg: '#f3e8ff', desc: 'Salon & grooming at home'    },
  { icon: 'fa-wrench',   label: 'Appliance Repair', value: 'REPAIR',   color: '#dc2626', bg: '#fee2e2', desc: 'AC, fridge & kitchen fixes'  },
  { icon: 'fa-leaf',     label: 'Gardening',        value: 'HOME',     color: '#0891b2', bg: '#cffafe', desc: 'Lawn care & landscaping'     },
];

const FEATURES = [
  { icon: 'fa-shield-halved',     color: '#2563eb', bg: '#dbeafe', title: 'Verified Professionals', desc: 'Every provider is background-checked and rated by real customers before joining our platform.' },
  { icon: 'fa-clock',             color: '#16a34a', bg: '#dcfce7', title: 'Same-Day Service',       desc: 'Book a professional and get help as early as today — no long waits, no hassle.' },
  { icon: 'fa-indian-rupee-sign', color: '#d97706', bg: '#fef3c7', title: 'Transparent Pricing',   desc: 'See exact prices upfront. No hidden charges, no surprises when the job is done.' },
  { icon: 'fa-headset',           color: '#9333ea', bg: '#f3e8ff', title: '24/7 Support',           desc: 'Our dedicated support team is always available to help you resolve any issue.' },
];

const TESTIMONIALS = [
  { name: 'Ananya R.',  city: 'Chennai',   avatar: 'AR', rating: 5, text: 'The plumber arrived within the hour and fixed the leak perfectly. Super professional and affordable!' },
  { name: 'Vikram S.',  city: 'Mumbai',    avatar: 'VS', rating: 5, text: 'Excellent home cleaning service. The team was thorough, polite, and left the house spotless.' },
  { name: 'Preethi M.', city: 'Bengaluru', avatar: 'PM', rating: 5, text: 'Booked a beautician for a home visit — seamless experience from booking to the final result.' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: 'fa-magnifying-glass', title: 'Search a Service', desc: 'Browse hundreds of services by category or keyword. Filter by city to find pros near you.' },
  { step: '02', icon: 'fa-calendar-check',   title: 'Book Instantly',   desc: 'Pick your preferred date, fill in your address, and confirm in under 2 minutes.' },
  { step: '03', icon: 'fa-star',             title: 'Get It Done',      desc: 'A verified professional arrives on time. Pay after the job and leave an honest review.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    servicesAPI.getAll().then(d => setFeaturedServices((d || []).slice(0, 3))).catch(() => {});
    providersAPI.getAll().then(d => setTopProviders((d || []).slice(0, 3))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`);
  };

  return (
    <div className="home-page">
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg-overlay" />
        <div className="hero-inner container">
          <div className="hero-text">
            <span className="hero-pill">
              <i className="fa-solid fa-circle-check" /> Trusted by 10,000+ customers
            </span>
            <h1>Find Trusted<br /><span className="hero-accent">Local Services</span></h1>
            <p>Book verified professionals for plumbing, cleaning, beauty, repairs and more — all in one place, anytime.</p>

            <form className="hero-search-bar" onSubmit={handleSearch}>
              <div className="hsb-input-wrap">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="text"
                  placeholder="Search plumbing, cleaning, beauty…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search services"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                <i className="fa-solid fa-search" /> Search
              </button>
            </form>

            <div className="hero-quick-links">
              <span>Popular:</span>
              {['Plumbing', 'Cleaning', 'Electrical', 'Beauty'].map(k => (
                <button key={k} className="quick-link" onClick={() => navigate(`/services?q=${k}`)}>
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-stats-strip">
            {[
              { value: '500+',    label: 'Verified Pros',     icon: 'fa-users-gear' },
              { value: '10,000+', label: 'Happy Customers',   icon: 'fa-face-smile' },
              { value: '50+',     label: 'Cities Covered',    icon: 'fa-map-location-dot' },
              { value: '4.9★',   label: 'Average Rating',    icon: 'fa-star' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <i className={`fa-solid ${s.icon}`} />
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-head">
            <h2>Popular Categories</h2>
            <p>Find the right service for every need</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                className="cat-card"
                style={{ '--cc': cat.color, '--cb': cat.bg }}
                onClick={() => navigate(`/services?category=${cat.value}`)}
              >
                <div className="cat-icon"><i className={`fa-solid ${cat.icon}`} /></div>
                <div className="cat-body">
                  <h4>{cat.label}</h4>
                  <p>{cat.desc}</p>
                </div>
                <span className="cat-arrow"><i className="fa-solid fa-arrow-right" /></span>
              </button>
            ))}
          </div>
          <div className="section-action">
            <button className="btn btn-outline" onClick={() => navigate('/services')}>
              View All Services <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-head">
            <h2>How It Works</h2>
            <p>Book a service in three simple steps</p>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="how-card">
                <div className="how-step">{h.step}</div>
                <div className="how-icon"><i className={`fa-solid ${h.icon}`} /></div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <span className="how-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES ────────────────────── */}
      {featuredServices.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="section-head">
              <h2>Featured Services</h2>
              <p>Handpicked top-rated services available today</p>
            </div>
            <div className="featured-grid">
              {featuredServices.map(s => (
                <div key={s.id} className="featured-card">
                  <div className="fc-top">
                    <div className="fc-icon"><i className={`fa-solid ${s.icon || 'fa-tools'}`} /></div>
                    <span className="badge-soft">{s.category}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <div className="fc-meta">
                    <span><i className="fa-solid fa-star" /> {s.rating}</span>
                    <span><i className="fa-solid fa-location-dot" /> {s.city}</span>
                    <span><i className="fa-solid fa-indian-rupee-sign" /> From ₹{s.price}</span>
                  </div>
                  <button className="btn btn-primary btn-sm fc-btn" onClick={() => navigate('/services')}>
                    Book Now
                  </button>
                </div>
              ))}
            </div>
            <div className="section-action">
              <button className="btn btn-outline" onClick={() => navigate('/services')}>
                Browse All Services <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ─────────────────────────── */}
      <section className="section bg-gray">
        <div className="container">
          <div className="section-head">
            <h2>Why Choose Us?</h2>
            <p>We make finding and booking local services simple and reliable</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card" style={{ '--fc': f.color, '--fb': f.bg }}>
                <div className="feature-icon"><i className={`fa-solid ${f.icon}`} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP PROVIDERS ────────────────────────── */}
      {topProviders.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="section-head">
              <h2>Top Providers</h2>
              <p>Meet some of our highest-rated professionals</p>
            </div>
            <div className="top-providers-grid">
              {topProviders.map(p => (
                <div key={p.id} className="tp-card">
                  <div className="tp-avatar">
                    {p.name.charAt(0)}
                    {p.verified && <span className="verified-dot" title="Verified"><i className="fa-solid fa-circle-check" /></span>}
                  </div>
                  <h3>{p.name}</h3>
                  <span className="badge-soft">{p.specialty}</span>
                  <div className="tp-stats">
                    <span><i className="fa-solid fa-star" /> {p.rating}</span>
                    <span><i className="fa-solid fa-briefcase" /> {p.jobs_completed} jobs</span>
                    <span><i className="fa-solid fa-clock" /> {p.experience_years} yrs</span>
                  </div>
                  <p className="tp-location"><i className="fa-solid fa-location-dot" /> {p.location}</p>
                </div>
              ))}
            </div>
            <div className="section-action">
              <button className="btn btn-outline" onClick={() => navigate('/providers')}>
                View All Providers <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="section bg-primary-subtle">
        <div className="container">
          <div className="section-head light">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card">
                <div className="tc-quote"><i className="fa-solid fa-quote-left" /></div>
                <p>"{t.text}"</p>
                <div className="tc-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star" />
                  ))}
                </div>
                <div className="tc-author">
                  <div className="tc-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Ready to get started?</h2>
              <p>Join thousands of happy customers and book your first service today.</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-white btn-lg" onClick={() => navigate('/services')}>
                <i className="fa-solid fa-briefcase" /> Browse Services
              </button>
              <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/register')}>
                <i className="fa-solid fa-user-plus" /> Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
