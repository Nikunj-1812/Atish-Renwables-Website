import { motion } from 'framer-motion';
import { useState } from 'react';
import { Factory, BriefcaseBusiness, Home, Mail, MessageCircle } from 'lucide-react';
import SectionHeading from './SectionHeading';
import Button from './Button';
import { contactMethods } from '../data/siteData';
import { hoverLift, mediaHover, sectionMotion, staggerContainer, staggerItem } from '../utils/motion';
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
              {contactMethods.map((item) => (
                <motion.a key={item.title} className="stack-item" href={item.link} variants={staggerItem}>
                  <div className="stack-item__icon">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', fontWeight: 800 }}>
                      {item.title}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--primary-strong)' }}>{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            <div style={{ marginTop: 24 }}>
              <Button href="https://wa.me/919876543210" variant="primary">
                <MessageCircle size={16} />
                Chat on WhatsApp
              </Button>
            </div>
          </motion.aside>

          <motion.div className="form-card" {...hoverLift} {...mediaHover}>
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
