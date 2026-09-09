import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { providersAPI } from '../utils/api';

const SPECIALTIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Beauty', 'Repair', 'Gardening'];

const SPEC_STYLES = {
  Plumbing:   { color: '#2563eb', bg: '#dbeafe', icon: 'fa-faucet'   },
  Electrical: { color: '#d97706', bg: '#fef3c7', icon: 'fa-bolt'     },
  Cleaning:   { color: '#16a34a', bg: '#dcfce7', icon: 'fa-broom'    },
  Beauty:     { color: '#9333ea', bg: '#f3e8ff', icon: 'fa-scissors' },
  Repair:     { color: '#dc2626', bg: '#fee2e2', icon: 'fa-wrench'   },
  Gardening:  { color: '#0891b2', bg: '#cffafe', icon: 'fa-leaf'     },
};

const FALLBACK = [
  { id: 'p1', name: 'Rajan Kumar',    location: 'T. Nagar, Chennai',       specialty: 'Plumbing',   rating: 4.9, jobs_completed: 312, experience_years: 12, verified: true  },
  { id: 'p2', name: 'Suresh M.',      location: 'Adyar, Chennai',          specialty: 'Electrical', rating: 4.8, jobs_completed: 245, experience_years: 8,  verified: true  },
  { id: 'p3', name: 'Priya Devi',     location: 'Velachery, Chennai',      specialty: 'Cleaning',   rating: 4.7, jobs_completed: 198, experience_years: 5,  verified: true  },
  { id: 'p4', name: 'Meena S.',       location: 'Anna Nagar, Chennai',     specialty: 'Beauty',     rating: 4.9, jobs_completed: 421, experience_years: 10, verified: true  },
  { id: 'p5', name: 'Kumar Raj',      location: 'Tambaram, Chennai',       specialty: 'Repair',     rating: 4.6, jobs_completed: 176, experience_years: 7,  verified: true  },
  { id: 'p6', name: 'Green Thumb Co.',location: 'Sholinganallur, Chennai', specialty: 'Gardening',  rating: 4.8, jobs_completed: 134, experience_years: 6,  verified: false },
];

export default function Providers() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [specialty, setSpecialty] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await providersAPI.getAll();
      setProviders(data?.length ? data : FALLBACK);
    } catch {
      setProviders(FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  let filtered = providers.filter(p => {
    const specMatch = specialty === 'All' || p.specialty === specialty;
    return specMatch;
  });

  const clearFilters = () => setSpecialty('All');

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="bc-link">Home</span>
            <i className="fa-solid fa-chevron-right" />
            <span>Providers</span>
          </div>
          <h1><i className="fa-solid fa-users-gear" /> Service Providers</h1>
          <p>Meet our verified professionals — skilled, experienced, and ready to help</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="providers-layout">

            {/* ── Sidebar ── */}
            <aside className="services-sidebar">
              <div className="sidebar-box">
                <h3 className="sb-title"><i className="fa-solid fa-filter" /> Filters</h3>

                <div className="sb-section">
                  <label className="sb-label">Specialty</label>
                  <div className="sb-cats">
                    {SPECIALTIES.map(sp => (
                      <button
                        key={sp}
                        className={`sb-cat-btn${specialty === sp ? ' active' : ''}`}
                        onClick={() => setSpecialty(sp)}
                      >
                        {SPEC_STYLES[sp] && <i className={`fa-solid ${SPEC_STYLES[sp].icon}`} />}
                        {sp}
                        <span className="sb-cat-count">
                          {sp === 'All' ? providers.length : providers.filter(p => p.specialty === sp).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {specialty !== 'All' && (
                  <button className="btn btn-outline btn-sm btn-block mt-3" onClick={clearFilters}>
                    <i className="fa-solid fa-rotate-left" /> Clear Filters
                  </button>
                )}
              </div>
            </aside>

            {/* ── Cards ── */}
            <div className="services-main">
              <div className="services-toolbar">
                <p className="results-count">
                  {loading ? 'Loading…' : `${filtered.length} provider${filtered.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner" />
                  <p>Loading providers…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-user-slash" />
                  <h4>No providers found</h4>
                  <p>Try a different specialty or clear your filters.</p>
                  <button className="btn btn-primary mt-3" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="providers-grid">
                  {filtered.map(p => {
                    const ss = SPEC_STYLES[p.specialty] || { color: '#6b7280', bg: '#f3f4f6', icon: 'fa-user' };
                    return (
                      <article key={p.id} className="prov-card" style={{ '--pc': ss.color, '--pb': ss.bg }}>
                        <div className="prov-avatar">
                          <span>{p.name.charAt(0)}</span>
                        </div>
                        <h3 className="prov-name">{p.name}</h3>
                        <div className="prov-specialty">
                          <i className={`fa-solid ${ss.icon}`} />
                          {p.specialty}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
