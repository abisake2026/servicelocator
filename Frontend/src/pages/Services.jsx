import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { servicesAPI } from '../utils/api';

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'All categories' },
  { value: 'HOME', label: 'Home' },
  { value: 'REPAIR', label: 'Repair' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'OTHER', label: 'Other' },
];

const CAT_COLORS = {
  HOME: { color: '#2563eb', bg: '#dbeafe' },
  REPAIR: { color: '#dc2626', bg: '#fee2e2' },
  CLEANING: { color: '#16a34a', bg: '#dcfce7' },
  BEAUTY: { color: '#9333ea', bg: '#f3e8ff' },
  OTHER: { color: '#6b7280', bg: '#f3f4f6' },
};

const FALLBACK_SERVICES = [
  { id: 'f1', name: 'Plumbing Repair', category: 'HOME', city: 'Chennai', price: 49, rating: 4.9, icon: 'fa-faucet', description: 'Leak detection, pipe repairs, and bathroom plumbing fixes.' },
  { id: 'f2', name: 'Electrical Service', category: 'REPAIR', city: 'Chennai', price: 65, rating: 4.8, icon: 'fa-bolt', description: 'Wiring, lights, ceiling fan repair, and electrical inspections.' },
  { id: 'f3', name: 'Home Cleaning', category: 'CLEANING', city: 'Chennai', price: 40, rating: 4.7, icon: 'fa-broom', description: 'Routine cleaning, deep cleaning, and apartment maintenance.' },
  { id: 'f4', name: 'Hair & Beauty', category: 'BEAUTY', city: 'Chennai', price: 55, rating: 4.9, icon: 'fa-scissors', description: 'Hair styling, skincare, and grooming appointments.' },
  { id: 'f5', name: 'Appliance Fix', category: 'REPAIR', city: 'Chennai', price: 58, rating: 4.6, icon: 'fa-wrench', description: 'Repair for washing machines, ovens, and kitchen appliances.' },
  { id: 'f6', name: 'Garden Care', category: 'HOME', city: 'Chennai', price: 45, rating: 4.8, icon: 'fa-leaf', description: 'Lawn care, plantation support, and outdoor maintenance.' },
];

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [bookingService, setBookingService] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await servicesAPI.getAll();
      setServices(data?.length ? data : FALLBACK_SERVICES);
    } catch {
      setServices(FALLBACK_SERVICES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cities = [...new Set(services.map((service) => service.city).filter(Boolean))].sort();
  const filteredServices = services.filter((service) => {
    const text = `${service.name} ${service.description || ''} ${service.category} ${service.city}`.toLowerCase();
    return (!search.trim() || text.includes(search.trim().toLowerCase()))
      && (category === 'ALL' || service.category === category)
      && (city === 'ALL' || service.city === city);
  });

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="banner-breadcrumb">
            <span onClick={() => navigate('/')} className="bc-link">Home</span>
            <i className="fa-solid fa-chevron-right" />
            <span>Services</span>
          </div>
          <h1><i className="fa-solid fa-briefcase" /> Our Services</h1>
          <p>Find and book professional services in your area</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="services-toolbar">
            <div>
              <h2 className="admin-section-title">Find a service</h2>
              <p className="results-count">{loading ? 'Loading...' : `${filteredServices.length} service${filteredServices.length === 1 ? '' : 's'} found`}</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setCategory('ALL'); setCity('ALL'); }}>
              <i className="fa-solid fa-rotate-left" /> Clear filters
            </button>
          </div>

          <div className="service-filters">
            <div className="service-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services..." aria-label="Search services" />
            </div>
            <select className="form-control" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
              {CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select className="form-control" value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city">
              <option value="ALL">All cities</option>
              {cities.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="loading-state"><i className="fa-solid fa-spinner fa-spin" /><p>Loading services...</p></div>
          ) : filteredServices.length === 0 ? (
            <div className="empty-state"><i className="fa-solid fa-magnifying-glass" /><h4>No services found</h4><p>Try another search or clear the filters.</p></div>
          ) : (
            <div className="services-list">
              {filteredServices.map((service) => {
                const colors = CAT_COLORS[service.category] || CAT_COLORS.OTHER;
                return (
                  <article key={service.id} className="svc-list-item" style={{ '--sc': colors.color, '--sb': colors.bg }}>
                    <div className="svc-list-icon"><i className={`fa-solid ${service.icon || 'fa-tools'}`} /></div>
                    <div className="svc-list-body">
                      <div className="svc-list-top"><h3>{service.name}</h3></div>
                      <p>{service.description}</p>
                      <div className="svc-meta">
                        <span><i className="fa-solid fa-star" /> {service.rating}</span>
                        <span><i className="fa-solid fa-location-dot" /> {service.city}</span>
                        <span><i className="fa-solid fa-clock" /> Same day</span>
                      </div>
                    </div>
                    <div className="svc-list-action">
                      <strong>₹{service.price}</strong>
                      <button className="btn btn-primary btn-sm" onClick={() => setBookingService(service)}>Book Now</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {bookingService && <BookingModal service={bookingService} onClose={() => setBookingService(null)} />}

      <Footer />
    </div>
  );
}
