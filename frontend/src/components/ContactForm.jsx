import { motion } from 'framer-motion';
import { useState } from 'react';
import { Factory, BriefcaseBusiness, Home, Mail, MessageCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { contactMethods } from '../data/siteData';
import { hoverLift, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';
import { submitContactForm } from '../utils/api';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [requirement, setRequirement] = useState('industrial');
  const [submittedRequirement, setSubmittedRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    bill: '',
    message: '',
  });

  const requirementOptions = [
    { value: 'industrial', label: 'Industrial', icon: Factory },
    { value: 'commercial', label: 'Commercial', icon: BriefcaseBusiness },
    { value: 'residential', label: 'Residential', icon: Home },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Basic frontend validation & sanitization
    const sanitize = (s) => (typeof s === 'string' ? s.trim() : s);
    const name = sanitize(formValues.name);
    const phone = sanitize(formValues.phone);
    const email = sanitize(formValues.email);
    const city = sanitize(formValues.city);
    const bill = formValues.bill ? Number(formValues.bill) : undefined;
    const message = sanitize(formValues.message);

    if (!name || name.length < 2) {
      setError('Please provide a valid name.');
      setLoading(false);
      return;
    }
    const phonePattern = /^[+0-9\s-]{7,20}$/;
    if (!phone || !phonePattern.test(phone)) {
      setError('Please provide a valid phone number.');
      setLoading(false);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setError('Please provide a valid email address.');
      setLoading(false);
      return;
    }
    if (!city) {
      setError('Please provide your city or location.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      phone,
      email,
      city,
      requirement,
      ...(typeof bill === 'number' && !Number.isNaN(bill) && { monthlyBill: bill }),
      ...(message && { message }),
    };

    const result = await submitContactForm(payload);

    setLoading(false);

    if (result.success) {
      setSubmittedRequirement(requirement);
      setSubmitted(true);
      // Reset form after success
      setFormValues({
        name: '',
        phone: '',
        email: '',
        city: '',
        bill: '',
        message: '',
      });
      setRequirement('industrial');
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } else {
      setError(result.error || 'Failed to submit form. Please try again.');
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Contact"
          title="Tell us about your solar requirement"
          copy="Share the project scope and our team will respond with the right engineering direction and a clean quotation path."
        />

        <div className="contact-grid">
          <motion.aside className="panel" {...hoverLift} style={{ padding: 24 }}>
            <h3 className="service-card__title">Contact Info &amp; Support</h3>
            <motion.div className="stack" variants={staggerContainer} initial="hidden" animate="show">
              {contactMethods.map((item) => {
                const isLink = item.link && item.link !== '#';
                const Tag = isLink ? motion.a : motion.div;
                const linkProps = isLink ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <Tag
                    key={item.title}
                    className="stack-item"
                    style={{ cursor: isLink ? 'pointer' : 'default' }}
                    {...linkProps}
                    variants={staggerItem}
                  >
                    <div className="stack-item__icon">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', fontWeight: 800 }}>
                        {item.title}
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary-strong)' }}>{item.value}</div>
                    </div>
                  </Tag>
                );
              })}
            </motion.div>

            <div style={{ marginTop: 24 }}>
              <a
                href="https://wa.me/916359260330?text=Hi%20Atish%20Renewables%20%F0%9F%8C%9E%2C%20I%27m%20interested%20in%20your%20solar%20solutions."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                  border: 'none',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.441 0 9.866-4.423 9.87-9.869.002-2.639-1.018-5.12-2.87-6.974C17.202 1.908 14.72 1.888 12.007 1.888c-5.45 0-9.873 4.424-9.877 9.87-.001 1.997.518 3.948 1.503 5.679L2.64 21.365l4.007-1.461zm11.238-6.195c-.3-.15-1.774-.875-2.031-.969-.258-.094-.446-.14-.633.14-.187.281-.726.912-.89 1.096-.164.186-.328.21-.628.06-.3-.15-1.267-.467-2.414-1.491-.892-.797-1.494-1.78-1.67-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.499.1-.2.05-.375-.025-.524-.075-.15-.633-1.527-.868-2.09-.23-.553-.483-.477-.633-.485-.15-.008-.323-.009-.496-.009-.174 0-.458.065-.697.325-.24.26-1.12 1.095-1.12 2.67 0 1.575 1.147 3.097 1.303 3.303.158.205 2.257 3.447 5.467 4.834.763.33 1.358.527 1.821.674.767.243 1.465.209 2.016.127.615-.093 1.774-.725 2.023-1.425.25-.7.25-1.3.175-1.425-.075-.125-.25-.2-.55-.35z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.aside>

          <motion.div className="form-card" {...hoverLift}>
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field">
                <label>Requirement *</label>
                <div className="requirement-options" role="radiogroup" aria-label="Requirement selector">
                  {requirementOptions.map((option) => {
                    const Icon = option.icon;
                    const checked = requirement === option.value;

                    return (
                      <label key={option.value} className={`requirement-option ${checked ? 'requirement-option--active' : ''}`}>
                        <input
                          type="radio"
                          name="requirement"
                          value={option.value}
                          checked={checked}
                          onChange={(event) => setRequirement(event.target.value)}
                        />
                        <span className="requirement-option__content">
                          <Icon size={16} />
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-grid form-grid--2">
                <div className="field">
                  <label htmlFor="name">Full name *</label>
                  <input id="name" placeholder="John Doe" required value={formValues.name} onChange={handleInputChange('name')} />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone number *</label>
                  <input id="phone" type="tel" placeholder="+91 00000 00000" required value={formValues.phone} onChange={handleInputChange('phone')} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email address *</label>
                  <input id="email" type="email" placeholder="john@example.com" required value={formValues.email} onChange={handleInputChange('email')} />
                </div>
                <div className="field">
                  <label htmlFor="city">City / location *</label>
                  <input id="city" placeholder="Bengaluru" required value={formValues.city} onChange={handleInputChange('city')} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="bill">Monthly electricity bill (₹)</label>
                <input id="bill" type="number" placeholder="e.g. 5000" value={formValues.bill} onChange={handleInputChange('bill')} />
              </div>

              <div className="field">
                <label htmlFor="message">Message / notes</label>
                <textarea id="message" rows="5" placeholder="Tell us more about your project..." value={formValues.message} onChange={handleInputChange('message')} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Enquiry'}
                <Mail size={16} />
              </button>
              {error ? (
                <p style={{ margin: 0, color: '#dc2626', fontWeight: 700 }}>
                  {error}
                </p>
              ) : null}
              {submitted ? (
                <p style={{ margin: 0, color: 'var(--primary-strong)', fontWeight: 700 }}>
                  Thanks! Your {submittedRequirement || requirement} request has been captured. Our team will reach out shortly.
                </p>
              ) : null}
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
