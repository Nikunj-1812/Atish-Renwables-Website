import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator as CalculatorIcon,
  Info,
  MapPin,
  PanelTop,
  Phone,
  User,
  Wallet,
  Zap,
  TrendingUp,
  Sun,
  Building2,
  Home,
  CalendarClock,
  Mail,
  Share2,
  Download,
  Leaf,
  Award,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { sectionMotion, staggerContainer, staggerItem, hoverLift } from '../utils/motion';
import { calculateSolarEstimate, emailSolarReport, API_URL } from '../utils/api';
import { calculateSolar } from '../utils/solarCalculator';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNum(value, decimals = 1) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(value);
}

export default function Calculator() {
  const [type, setType] = useState('residential'); // 'residential' | 'commercial'
  const [inputMode, setInputMode] = useState('bill'); // 'bill' | 'units' | 'area'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cityPincode: '',
    inputValue: '',
    state: 'Gujarat',
  });

  const [errors, setErrors] = useState({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Track focused field for active styling states
  const [focusedField, setFocusedField] = useState(null);



  // Email report send states
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Live Recalculation
  const results = useMemo(() => {
    return calculateSolar({
      inputMode,
      inputValue: parseFloat(formData.inputValue) || 0,
      customerType: type,
      pincode: formData.cityPincode,
    });
  }, [
    inputMode,
    formData.inputValue,
    type,
    formData.cityPincode,
  ]);

  // Premium consistent styling constants
  const labelStyle = {
    fontWeight: 700,
    fontSize: '0.78rem',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
    display: 'block',
  };

  const getInputStyle = (fieldName) => {
    const hasError = !!errors[fieldName];
    const isFocused = focusedField === fieldName;
    return {
      width: '100%',
      height: '46px',
      paddingLeft: '38px',
      paddingRight: '12px',
      borderRadius: 'var(--r-md)',
      border: hasError
        ? '1.5px solid #e11d48'
        : isFocused
          ? '1.5px solid var(--primary)'
          : '1.5px solid var(--border)',
      background: 'var(--surface)',
      outline: 'none',
      fontWeight: 600,
      fontSize: '0.92rem',
      color: 'var(--fg)',
      transition: 'border-color 0.18s, box-shadow 0.18s',
      boxShadow: isFocused ? '0 0 0 3px rgba(0, 80, 88, 0.12)' : 'none',
    };
  };

  const getMainInputStyle = () => {
    const hasError = !!errors.inputValue;
    const isFocused = focusedField === 'inputValue';
    return {
      border: hasError
        ? '1.5px solid #e11d48'
        : isFocused
          ? '1.5px solid var(--primary)'
          : '1.5px solid var(--border)',
      boxShadow: isFocused ? '0 0 0 3px rgba(0, 80, 88, 0.12)' : 'none',
      transition: 'border-color 0.18s, box-shadow 0.18s',
      height: '46px',
    };
  };

  const validateAllFields = () => {
    const localErrors = {};
    let firstInvalidId = null;

    // Validate Input Value
    const valInput = Number(formData.inputValue);
    if (formData.inputValue === '') {
      localErrors.inputValue = 'This field is required.';
      if (!firstInvalidId) firstInvalidId = 'calcInput';
    } else if (!Number.isFinite(valInput) || Number.isNaN(valInput) || valInput <= 0) {
      localErrors.inputValue = 'Please enter a valid positive number.';
      if (!firstInvalidId) firstInvalidId = 'calcInput';
    }

    // Validate Name
    if (!formData.name.trim()) {
      localErrors.name = 'Name is required.';
      if (!firstInvalidId) firstInvalidId = 'calcName';
    }

    // Validate Phone
    if (!formData.phone.trim()) {
      localErrors.phone = 'Phone number is required.';
      if (!firstInvalidId) firstInvalidId = 'calcPhone';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      localErrors.phone = 'Please enter a valid phone number.';
      if (!firstInvalidId) firstInvalidId = 'calcPhone';
    }

    // Validate Email
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      localErrors.email = 'Please enter a valid email address.';
      if (!firstInvalidId) firstInvalidId = 'calcEmail';
    }

    // Validate City/Pincode
    if (!formData.cityPincode.trim()) {
      localErrors.cityPincode = 'City or pincode is required.';
      if (!firstInvalidId) firstInvalidId = 'calcCity';
    }



    setErrors(localErrors);
    return { isValid: Object.keys(localErrors).length === 0, firstInvalidId };
  };

  const handleFieldChange = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
    
    // Perform dynamic validation only after the user has attempted submission once
    if (wasSubmitted) {
      // Small timeout to allow state updates
      setTimeout(() => {
        const errorsCheck = {};
        const valInput = Number(field === 'inputValue' ? val : formData.inputValue);
        const nameVal = String(field === 'name' ? val : formData.name);
        const phoneVal = String(field === 'phone' ? val : formData.phone);
        const emailVal = String(field === 'email' ? val : formData.email);
        const cityVal = String(field === 'cityPincode' ? val : formData.cityPincode);

        if (field === 'inputValue') {
          if (val === '') errorsCheck.inputValue = 'This field is required.';
          else if (!Number.isFinite(valInput) || valInput <= 0) errorsCheck.inputValue = 'Must be greater than zero.';
        }
        if (field === 'name') {
          if (!nameVal.trim()) errorsCheck.name = 'Name is required.';
        }
        if (field === 'phone') {
          if (!phoneVal.trim()) errorsCheck.phone = 'Phone number is required.';
          else if (!/^\+?[0-9\s-]{10,15}$/.test(phoneVal.trim())) errorsCheck.phone = 'Enter valid phone.';
        }
        if (field === 'email') {
          if (emailVal.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim())) errorsCheck.email = 'Enter valid email.';
        }
        if (field === 'cityPincode') {
          if (!cityVal.trim()) errorsCheck.cityPincode = 'Pincode is required.';
        }


        setErrors((prev) => ({ ...prev, [field]: errorsCheck[field] || '' }));
      }, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWasSubmitted(true);

    const { isValid, firstInvalidId } = validateAllFields();

    if (!isValid) {
      if (firstInvalidId) {
        const el = document.getElementById(firstInvalidId);
        if (el) {
          el.focus();
          // Scroll smoothly to invalid element if needed
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setLoading(true);
    setSubmitError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      pincode: formData.cityPincode,
      state: formData.state,
      monthlyElectricityBill: parseFloat(formData.inputValue),
      inputValue: parseFloat(formData.inputValue),
      inputMode: inputMode,
      electricityRate: 8.4,
      customerType: type,
    };

    const result = await calculateSolarEstimate(payload);

    if (result.success) {
      setLoading(false);
      setSuccess(true);
      // Play satisfying success animation before loading dashboard
      setTimeout(() => {
        setSubmitted(true);
        setSuccess(false);
      }, 1200);
    } else {
      setLoading(false);
      setSubmitError('Unable to sync calculation online. Displaying local report.');
      setSuccess(true);
      setTimeout(() => {
        setSubmitted(true);
        setSuccess(false);
      }, 1200);
    }
  };

  const handleEmailReport = async () => {
    setEmailSending(true);
    setEmailSent(false);
    setEmailError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      pincode: formData.cityPincode,
      state: formData.state,
      inputMode: inputMode,
      inputValue: parseFloat(formData.inputValue),
      electricityRate: 8.4,
      customerType: type,
    };

    const result = await emailSolarReport(payload);
    setEmailSending(false);

    if (result.success) {
      setEmailSent(true);
    } else {
      setEmailError(result.error || 'Failed to dispatch email report.');
    }
  };

  const hasResults = results !== null;

  // Default Result Cards shown BEFORE form submission
  const resultCards = hasResults
    ? [
        {
          label: 'System Size',
          value: `${formatNum(results.plantSizeKw)} kW`,
          icon: PanelTop,
          accent: 'primary',
        },
        {
          label: 'Net Investment',
          value: formatINR(results.netCost),
          icon: Wallet,
          accent: 'neutral',
        },
        {
          label: 'Monthly Generation',
          value: `${formatNum(results.monthlyGenerationKw, 0)} units`,
          icon: Sun,
          accent: 'neutral',
        },
        {
          label: 'Monthly Savings',
          value: formatINR(results.monthlySavings),
          icon: Zap,
          accent: 'primary',
        },
        {
          label: 'Annual Savings',
          value: formatINR(results.yearlySavings),
          icon: TrendingUp,
          accent: 'accent',
        },
        {
          label: 'Payback Period',
          value: `${formatNum(results.paybackPeriodYears)} yrs`,
          icon: CalendarClock,
          accent: 'accent',
        },
      ]
    : [];

  // Chart configuration for post-submission dashboard
  const chartWidth = 500;
  const chartHeight = 250;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const totalYears = 30;
  const maxSavings = results ? results.lifetimeSavings : 100000;
  const netCostVal = results ? results.netCost : 50000;
  const chartMax = Math.max(maxSavings, netCostVal) * 1.1 || 100000;

  const investmentY = results
    ? chartHeight - paddingBottom - (results.netCost / chartMax) * graphHeight
    : 0;

  const savingsPoints = [];
  if (results) {
    for (let yr = 0; yr <= totalYears; yr++) {
      const sav = results.yearlySavings * yr;
      const x = paddingLeft + (yr / totalYears) * graphWidth;
      const y = chartHeight - paddingBottom - (sav / chartMax) * graphHeight;
      savingsPoints.push(`${x},${y}`);
    }
  }
  const savingsPath = savingsPoints.length > 0 ? `M ${savingsPoints.join(' L ')}` : '';
  const areaPath = savingsPoints.length > 0
    ? `${savingsPath} L ${paddingLeft + graphWidth} ${chartHeight - paddingBottom} L ${paddingLeft} ${chartHeight - paddingBottom} Z`
    : '';

  // WhatsApp template content
  const shareMessage = results
    ? `*Solar Estimation Report* 🌞\n` +
      `Atish Renewables\n\n` +
      `*Customer:* ${formData.name}\n` +
      `*System Size:* ${results.plantSizeKw.toFixed(1)} kW\n` +
      `*Total Project Cost:* ₹${Math.round(results.netCost).toLocaleString('en-IN')}\n` +
      `*Monthly Savings:* ₹${Math.round(results.monthlySavings).toLocaleString('en-IN')}\n` +
      `*Yearly Savings:* ₹${Math.round(results.yearlySavings).toLocaleString('en-IN')}\n` +
      `*Lifetime Savings (30 yrs):* ₹${Math.round(results.lifetimeSavings).toLocaleString('en-IN')}\n` +
      `*Payback Period:* ${results.paybackPeriodYears.toFixed(1)} years\n` +
      `*ROI:* ${results.roi.toFixed(1)}%\n\n` +
      `Generate your professional report at Atish Renewables!`
    : '';

  const whatsappUrl = `https://wa.me/916359260330?text=${encodeURIComponent(shareMessage)}`;

  // Download URL
  const pdfDownloadUrl = results
    ? `${API_URL}/solar/download-pdf?` +
      new URLSearchParams({
        inputMode,
        inputValue: formData.inputValue,
        electricityRate: '8.4',
        customerType: type,
        pincode: formData.cityPincode,
        state: formData.state,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      }).toString()
    : '#';

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Calculator"
          title="Estimate your solar savings instantly"
          copy="Enter your details below to calculate plant size, generation, financials, and environmental offset metrics."
        />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="calculator-inputs"
              className="calc-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* ── Left: Input panel ── */}
              <motion.div className="form-card calc-input-card" {...hoverLift}>
                {/* Type toggle */}
                <div className="calc-type-toggle" role="group" aria-label="Installation type">
                  <button
                    type="button"
                    className={`calc-type-btn${type === 'residential' ? ' calc-type-btn--active' : ''}`}
                    onClick={() => setType('residential')}
                    aria-pressed={type === 'residential'}
                  >
                    <Home size={16} aria-hidden="true" />
                    Residential
                  </button>
                  <button
                    type="button"
                    className={`calc-type-btn${type === 'commercial' ? ' calc-type-btn--active' : ''}`}
                    onClick={() => setType('commercial')}
                    aria-pressed={type === 'commercial'}
                  >
                    <Building2 size={16} aria-hidden="true" />
                    Commercial
                  </button>
                </div>

                {/* Input Mode Toggle */}
                <div className="field">
                  <label style={labelStyle}>Input Method</label>
                  <div 
                    className="calc-type-toggle" 
                    role="group" 
                    aria-label="Input Mode"
                    style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}
                  >
                    <button
                      type="button"
                      className={`calc-type-btn${inputMode === 'bill' ? ' calc-type-btn--active' : ''}`}
                      onClick={() => {
                        setInputMode('bill');
                        setFormData((prev) => ({ ...prev, inputValue: '' }));
                        if (wasSubmitted) setErrors((prev) => ({ ...prev, inputValue: '' }));
                      }}
                      style={{ padding: '8px 4px', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Bill (₹)
                    </button>
                    <button
                      type="button"
                      className={`calc-type-btn${inputMode === 'units' ? ' calc-type-btn--active' : ''}`}
                      onClick={() => {
                        setInputMode('units');
                        setFormData((prev) => ({ ...prev, inputValue: '' }));
                        if (wasSubmitted) setErrors((prev) => ({ ...prev, inputValue: '' }));
                      }}
                      style={{ padding: '8px 4px', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Units (kWh)
                    </button>
                    <button
                      type="button"
                      className={`calc-type-btn${inputMode === 'area' ? ' calc-type-btn--active' : ''}`}
                      onClick={() => {
                        setInputMode('area');
                        setFormData((prev) => ({ ...prev, inputValue: '' }));
                        if (wasSubmitted) setErrors((prev) => ({ ...prev, inputValue: '' }));
                      }}
                      style={{ padding: '8px 4px', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      Area (Sq Ft)
                    </button>
                  </div>
                </div>

                {/* Dynamic Main Input */}
                <div className="field">
                  <label htmlFor="calcInput" style={labelStyle}>
                    {inputMode === 'bill' && 'Monthly Electricity Bill'}
                    {inputMode === 'units' && 'Monthly Electricity Consumption'}
                    {inputMode === 'area' && 'Rooftop Area Available'}
                  </label>
                  <div className="calc-input-wrap" style={getMainInputStyle()}>
                    <span className="calc-input-prefix" aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
                      {inputMode === 'bill' && '₹'}
                      {inputMode === 'units' && 'kWh'}
                      {inputMode === 'area' && 'ft²'}
                    </span>
                    <input
                      id="calcInput"
                      type="number"
                      min="0"
                      placeholder={
                        inputMode === 'bill' ? 'e.g. 5000' :
                        inputMode === 'units' ? 'e.g. 600' : 'e.g. 500'
                      }
                      value={formData.inputValue}
                      onChange={handleFieldChange('inputValue')}
                      onFocus={() => setFocusedField('inputValue')}
                      onBlur={() => setFocusedField(null)}
                      className="calc-bill-input"
                      aria-required="true"
                    />
                  </div>
                  {errors.inputValue && (
                    <span style={{ color: '#e11d48', fontSize: '0.75rem', marginTop: 4, display: 'block', fontWeight: 600 }}>
                      {errors.inputValue}
                    </span>
                  )}
                </div>



                <hr className="calc-divider" />

                {/* Contact Form Details */}
                <form onSubmit={handleSubmit} noValidate>
                  <p className="calc-contact-heading" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--primary-strong)' }}>Get a free site survey &amp; report</p>
                  <div className="calc-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="field">
                      <label htmlFor="calcName" style={labelStyle}>Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} className="calc-field-icon" aria-hidden="true" />
                        <input
                          id="calcName"
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleFieldChange('name')}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          style={getInputStyle('name')}
                          aria-required="true"
                        />
                      </div>
                      {errors.name && <span style={{ color: '#e11d48', fontSize: '0.72rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{errors.name}</span>}
                    </div>

                    <div className="field">
                      <label htmlFor="calcPhone" style={labelStyle}>Phone</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} className="calc-field-icon" aria-hidden="true" />
                        <input
                          id="calcPhone"
                          required
                          type="tel"
                          placeholder="98765 XXXXX"
                          value={formData.phone}
                          onChange={handleFieldChange('phone')}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          style={getInputStyle('phone')}
                          aria-required="true"
                        />
                      </div>
                      {errors.phone && <span style={{ color: '#e11d48', fontSize: '0.72rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{errors.phone}</span>}
                    </div>

                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="calcEmail" style={labelStyle}>Email Address (Optional)</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} className="calc-field-icon" aria-hidden="true" />
                        <input
                          id="calcEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleFieldChange('email')}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          style={getInputStyle('email')}
                        />
                      </div>
                      {errors.email && <span style={{ color: '#e11d48', fontSize: '0.72rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{errors.email}</span>}
                    </div>

                    <div className="field" style={{ gridColumn: '1 / -1' }}>
                      <label htmlFor="calcCity" style={labelStyle}>City / Pincode</label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} className="calc-field-icon" aria-hidden="true" />
                        <input
                          id="calcCity"
                          required
                          placeholder="e.g. Vadodara / 390020"
                          value={formData.cityPincode}
                          onChange={handleFieldChange('cityPincode')}
                          onFocus={() => setFocusedField('cityPincode')}
                          onBlur={() => setFocusedField(null)}
                          style={getInputStyle('cityPincode')}
                          aria-required="true"
                        />
                      </div>
                      {errors.cityPincode && <span style={{ color: '#e11d48', fontSize: '0.72rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{errors.cityPincode}</span>}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading || success}
                    style={{
                      width: '100%',
                      marginTop: 20,
                      height: '46px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      opacity: (loading || success) ? 0.75 : 1,
                      cursor: (loading || success) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          style={{ display: 'inline-flex', width: 16, height: 16 }}
                        >
                          <Loader2 size={16} />
                        </motion.div>
                        <span>Generating Report…</span>
                      </>
                    ) : success ? (
                      <>
                        <motion.div
                          initial={{ scale: 0.6 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                          style={{ display: 'inline-flex' }}
                        >
                          <CheckCircle size={18} style={{ color: '#fff' }} />
                        </motion.div>
                        <span>Success! Opening Dashboard…</span>
                      </>
                    ) : (
                      <>
                        <CalculatorIcon size={16} aria-hidden="true" />
                        <span>Generate Full Report</span>
                      </>
                    )}
                  </button>

                  {submitError && (
                    <p className="calc-hint" style={{ marginTop: 10, color: '#e11d48', fontWeight: 600 }}>
                      <Info size={13} aria-hidden="true" />
                      {submitError}
                    </p>
                  )}
                </form>
              </motion.div>

              {/* ── Right: Results panel ── */}
              <div className="calc-results-panel">
                <AnimatePresence mode="wait">
                  {hasResults ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="calc-results-header">
                        <h3 className="calc-results-title" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', fontWeight: 800 }}>Live Estimate</span>
                          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{type === 'residential' ? 'Residential' : 'Commercial'} System</span>
                        </h3>
                        <span className="calc-results-badge">
                          {formatNum(results.plantSizeKw)} kW recommended
                        </span>
                      </div>

                      <motion.div
                        className="calc-results-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                      >
                        {resultCards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <motion.article
                              key={card.label}
                              className={`panel calc-result-card calc-result-card--${card.accent}`}
                              variants={staggerItem}
                              style={{ border: '1px solid var(--border)' }}
                            >
                              <div className="calc-result-icon-wrap" aria-hidden="true">
                                <Icon size={18} />
                              </div>
                              <div className="calc-result-label">{card.label}</div>
                              <div className="calc-result-value">{card.value}</div>
                            </motion.article>
                          );
                        })}
                      </motion.div>

                      <p className="calc-disclaimer">
                        <Info size={13} aria-hidden="true" />
                        Estimates use ₹8.40/unit tariff. Full submission unlocks visual charts, payback tables, and PDF options.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="calc-empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Sun size={48} className="calc-empty-icon" aria-hidden="true" style={{ color: 'var(--primary)', opacity: 0.5 }} />
                      <p className="calc-empty-title">Enter your details to calculate</p>
                      <p className="calc-empty-sub">
                        Your solar investment metrics and savings will appear here instantly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* ─── Production Ready Dashboard Report View (Post-Submission) ─── */
            <motion.div
              key="calculator-dashboard"
              className="form-card"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              style={{
                maxWidth: '1040px',
                margin: '0 auto',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {/* Dashboard Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderBottom: '2px solid var(--border)', paddingBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>Atish Renewables</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 0 0', fontWeight: 700, letterSpacing: '0.05em' }}>SOLAR ASSESSMENT REPORT</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>Customer Information</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    <strong>{formData.name}</strong> ({formData.phone})<br />
                    {formData.email && <>{formData.email} | </>}
                    {results.location !== 'default' ? `${results.location} - ` : ''}{formData.cityPincode} ({formData.state})
                  </p>
                </div>
              </div>

              {/* Recommendation summary row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <PanelTop size={20} style={{ color: 'var(--primary)', marginBottom: 8, display: 'inline-block' }} />
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800, margin: 0 }}>System Size</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--primary-strong)' }}>{results.plantSizeKw} kW</p>
                </div>
                <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <Wallet size={20} style={{ color: 'var(--primary)', marginBottom: 8, display: 'inline-block' }} />
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800, margin: 0 }}>Total Project Cost</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--primary-strong)' }}>{formatINR(results.netCost)}</p>
                </div>
                <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <TrendingUp size={20} style={{ color: 'var(--accent-ink)', marginBottom: 8, display: 'inline-block' }} />
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800, margin: 0 }}>Payback Period</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--accent-ink)' }}>{results.paybackPeriodYears.toFixed(1)} Years</p>
                </div>
                <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <Award size={20} style={{ color: 'var(--primary)', marginBottom: 8, display: 'inline-block' }} />
                  <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 800, margin: 0 }}>System ROI</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: 'var(--primary-strong)' }}>{results.roi.toFixed(0)}%</p>
                </div>
              </div>

              {/* Financial Breakdowns & Visual SVG Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 8 }}>
                
                {/* Cost and Subsidy breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>Financial Valuation</h4>
                  
                  <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800 }}>
                      <span style={{ color: 'var(--primary-strong)' }}>Total Project Cost:</span>
                      <span style={{ color: 'var(--primary-strong)' }}>{formatINR(results.netCost)}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>Monthly Bill Savings:</span>
                      <strong style={{ color: 'var(--fg)' }}>{formatINR(results.monthlySavings)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>Yearly Bill Savings:</span>
                      <strong style={{ color: 'var(--fg)' }}>{formatINR(results.yearlySavings)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>30-Year Cumulative Savings:</span>
                      <strong style={{ color: 'var(--primary-strong)' }}>{formatINR(results.lifetimeSavings)}</strong>
                    </div>
                  </div>
                </div>

                {/* Return Curve (SVG Chart) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>30-Year Cumulative Returns Curve</h4>
                  
                  <div className="panel" style={{ padding: '12px', borderRadius: 'var(--r-lg)', background: '#ffffff', display: 'flex', justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', maxHeight: '200px' }}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="#eef2f3" strokeWidth="1" />
                      <line x1={paddingLeft} y1={paddingTop + graphHeight * 0.25} x2={chartWidth - paddingRight} y2={paddingTop + graphHeight * 0.25} stroke="#eef2f3" strokeWidth="1" />
                      <line x1={paddingLeft} y1={paddingTop + graphHeight * 0.5} x2={chartWidth - paddingRight} y2={paddingTop + graphHeight * 0.5} stroke="#eef2f3" strokeWidth="1" />
                      <line x1={paddingLeft} y1={paddingTop + graphHeight * 0.75} x2={chartWidth - paddingRight} y2={paddingTop + graphHeight * 0.75} stroke="#eef2f3" strokeWidth="1" />
                      <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="#cfd8dc" strokeWidth="1.5" />
                      
                      {/* Shaded Area under Savings Curve */}
                      {areaPath && <path d={areaPath} fill="url(#savingsGrad)" />}
                      
                      {/* Savings Line */}
                      {savingsPath && <path d={savingsPath} fill="none" stroke="var(--primary)" strokeWidth="3" />}
                      
                      {/* Net Cost Horizontal Line */}
                      <line
                        x1={paddingLeft}
                        y1={investmentY}
                        x2={chartWidth - paddingRight}
                        y2={investmentY}
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeDasharray="5,4"
                      />

                      {/* X-Axis labels */}
                      <text x={paddingLeft} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 0</text>
                      <text x={paddingLeft + graphWidth * 0.2} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 6</text>
                      <text x={paddingLeft + graphWidth * 0.4} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 12</text>
                      <text x={paddingLeft + graphWidth * 0.6} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 18</text>
                      <text x={paddingLeft + graphWidth * 0.8} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 24</text>
                      <text x={paddingLeft + graphWidth} y={chartHeight - 12} fontSize="9" fontWeight="700" fill="var(--muted)" textAnchor="middle">Yr 30</text>

                      {/* Y-Axis Label / Tooltip */}
                      <text x={paddingLeft - 8} y={investmentY + 3} fontSize="9" fontWeight="700" fill="#b45309" textAnchor="end">Net Cost</text>
                      <text x={chartWidth - paddingRight} y={chartHeight - paddingBottom - (results.lifetimeSavings / chartMax) * graphHeight - 6} fontSize="9" fontWeight="800" fill="var(--primary)" textAnchor="end">Savings Curve</text>
                    </svg>
                  </div>
                </div>

              </div>

              {/* Environmental Benefits & Score */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                
                {/* Environmental stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)' }}>
                    <Leaf size={18} style={{ color: 'var(--success, #25d366)' }} />
                    Environmental Metrics (Annual Offset)
                  </h4>
                  
                  <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>CO₂ Emissions Displaced:</span>
                      <strong style={{ color: 'var(--fg)' }}>{formatNum(results.co2ReductionKg, 0)} kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>Tree Absorbency Equivalent:</span>
                      <strong style={{ color: 'var(--fg)' }}>{formatNum(results.treesPlanted, 0)} Trees</strong>
                    </div>
                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--muted)' }}>Carbon Offsetting Value:</span>
                      <strong style={{ color: 'var(--fg)' }}>{formatNum(results.carbonOffsetTonnes, 2)} Tonnes</strong>
                    </div>
                  </div>
                </div>

                {/* Score and recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>Green Sustainability Rating</h4>
                  
                  <div className="panel" style={{ padding: '16px', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--muted)' }}>Green Index Score:</span>
                      <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-strong)' }}>{results.environmentalScore} / 100</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '10px', background: 'var(--surface-alt)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${results.environmentalScore}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #25d366)', borderRadius: '99px' }} />
                    </div>

                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                      Installing this system will displace carbon-intensive grid energy, preventing massive fossil-fuel coal consumption over its 30-year lifetime.
                    </p>
                  </div>
                </div>

              </div>

              {/* Action and Sharing Panel */}
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                
                {/* Reset button */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData((prev) => ({ ...prev, inputValue: '' }));
                    setEmailSent(false);
                    setEmailError(null);
                    setWasSubmitted(false);
                  }}
                  style={{ minWidth: '140px', height: '46px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Edit Specifications
                </button>

                {/* Share/Actions block */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end' }}>
                  
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      borderColor: '#25d366',
                      color: '#12b04a',
                      background: 'rgba(37, 211, 102, 0.08)',
                      height: '46px',
                      flex: '1 1 auto',
                      justifyContent: 'center',
                      minWidth: '150px',
                    }}
                  >
                    <Share2 size={16} />
                    WhatsApp Summary
                  </a>

                  {/* Email report */}
                  {formData.email && (
                    <button
                      type="button"
                      onClick={handleEmailReport}
                      disabled={emailSending}
                      className="btn btn-secondary"
                      style={{
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                        height: '46px',
                        flex: '1 1 auto',
                        justifyContent: 'center',
                        minWidth: '150px',
                      }}
                    >
                      <Mail size={16} />
                      {emailSending ? 'Sending PDF…' : emailSent ? 'Email Dispatched ✓' : 'Email PDF Report'}
                    </button>
                  )}

                  {/* PDF Download */}
                  <a
                    href={pdfDownloadUrl}
                    className="btn btn-primary"
                    style={{
                      height: '46px',
                      flex: '1 1 auto',
                      justifyContent: 'center',
                      minWidth: '160px',
                    }}
                  >
                    <Download size={16} />
                    Download PDF Report
                  </a>
                </div>

              </div>

              {/* Email Feedback Alerts */}
              {(emailSent || emailError) && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: emailSent ? 'rgba(37, 211, 102, 0.08)' : 'rgba(225, 29, 72, 0.08)',
                  color: emailSent ? '#12b04a' : '#e11d48',
                  border: `1.5px solid ${emailSent ? 'rgba(37, 211, 102, 0.25)' : 'rgba(225, 29, 72, 0.25)'}`,
                }}>
                  {emailSent && 'Your professional branded report has been successfully sent to your email address!'}
                  {emailError && `Failed to email report: ${emailError}`}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
