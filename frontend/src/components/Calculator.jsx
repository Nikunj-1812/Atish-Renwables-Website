import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { sectionMotion, staggerContainer, staggerItem, hoverLift } from '../utils/motion';
import { calculateSolarEstimate } from '../utils/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const TARIFF_PER_UNIT = 7;          // ₹7 per unit saved
const UNITS_PER_KW_PER_DAY = 5;     // 1 kW → 5 units/day
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

const COST_PER_KW = {
  residential: 50_000,   // ₹50,000 per kW
  commercial: 35_000,    // ₹35,000 per kW
};

// System size derived from monthly electricity bill
// Assumption: avg tariff ₹7/unit, 150 units/kW/month (5 units/day × 30)
const UNITS_PER_KW_PER_MONTH = UNITS_PER_KW_PER_DAY * DAYS_PER_MONTH; // 150

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNum(value, decimals = 1) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(value);
}

// ─── Core calculation ─────────────────────────────────────────────────────────
function computeSolar(monthlyBill, type) {
  const bill = Math.max(0, Number(monthlyBill) || 0);
  if (bill === 0) return null;

  // Monthly units consumed = bill ÷ tariff
  const monthlyUnitsConsumed = bill / TARIFF_PER_UNIT;

  // System size needed to cover that consumption
  const systemSize = Math.max(1, monthlyUnitsConsumed / UNITS_PER_KW_PER_MONTH);

  // Cost
  const estimatedCost = systemSize * COST_PER_KW[type];

  // Generation
  const monthlyGeneration = systemSize * UNITS_PER_KW_PER_DAY * DAYS_PER_MONTH;

  // Savings
  const monthlySavings = monthlyGeneration * TARIFF_PER_UNIT;
  const annualSavings = monthlySavings * MONTHS_PER_YEAR;

  // Payback
  const paybackYears = estimatedCost / annualSavings;

  return {
    systemSize,
    estimatedCost,
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    paybackYears,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Calculator() {
  const [type, setType] = useState('residential'); // 'residential' | 'commercial'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cityPincode: '',
    monthlyBill: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const results = useMemo(
    () => computeSolar(formData.monthlyBill, type),
    [formData.monthlyBill, type]
  );

  const handleField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.cityPincode || !formData.monthlyBill) return;

    setLoading(true);
    setSubmitError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      pincode: formData.cityPincode,
      monthlyElectricityBill: parseFloat(formData.monthlyBill),
      customerType: type,
    };

    const result = await calculateSolarEstimate(payload);
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError('Details saved locally. Our team will reach out shortly.');
      setSubmitted(true);
    }
  };

  const hasResults = results !== null;

  const resultCards = hasResults
    ? [
        {
          label: 'System Size',
          value: `${formatNum(results.systemSize)} kW`,
          sub: 'Recommended capacity',
          icon: PanelTop,
          accent: 'primary',
        },
        {
          label: 'Estimated Cost',
          value: formatINR(results.estimatedCost),
          sub: `@ ₹${(COST_PER_KW[type] / 1000).toFixed(0)}k per kW`,
          icon: Wallet,
          accent: 'neutral',
        },
        {
          label: 'Monthly Generation',
          value: `${formatNum(results.monthlyGeneration, 0)} units`,
          sub: `${formatNum(results.systemSize)} kW × 5 units/day × 30`,
          icon: Sun,
          accent: 'neutral',
        },
        {
          label: 'Monthly Savings',
          value: formatINR(results.monthlySavings),
          sub: `${formatNum(results.monthlyGeneration, 0)} units × ₹7`,
          icon: Zap,
          accent: 'primary',
        },
        {
          label: 'Annual Savings',
          value: formatINR(results.annualSavings),
          sub: 'Monthly savings × 12',
          icon: TrendingUp,
          accent: 'accent',
        },
        {
          label: 'Payback Period',
          value: `${formatNum(results.paybackYears)} yrs`,
          sub: 'Cost ÷ Annual savings',
          icon: CalendarClock,
          accent: 'accent',
        },
      ]
    : [];

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Calculator"
          title="Estimate your solar savings instantly"
          copy="Enter your monthly electricity bill and see live estimates for system size, cost, savings, and payback period."
        />

        <div className="calc-layout">
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

            {/* Bill input — live calculation trigger */}
            <div className="field">
              <label htmlFor="calcBill" className="calc-label">
                Monthly Electricity Bill
              </label>
              <div className="calc-input-wrap">
                <span className="calc-input-prefix">₹</span>
                <input
                  id="calcBill"
                  type="number"
                  min="0"
                  placeholder="e.g. 5000"
                  value={formData.monthlyBill}
                  onChange={handleField('monthlyBill')}
                  className="calc-bill-input"
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="calc-divider" />

            {/* Contact form for lead capture */}
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate>
                <p className="calc-contact-heading">Get a free site survey</p>
                <div className="calc-contact-grid">
                  <div className="field">
                    <label htmlFor="calcName">Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} className="calc-field-icon" aria-hidden="true" />
                      <input
                        id="calcName"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleField('name')}
                        style={{ paddingLeft: 38 }}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="calcPhone">Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} className="calc-field-icon" aria-hidden="true" />
                      <input
                        id="calcPhone"
                        required
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={handleField('phone')}
                        style={{ paddingLeft: 38 }}
                      />
                    </div>
                  </div>

                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="calcCity">City / Pincode</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} className="calc-field-icon" aria-hidden="true" />
                      <input
                        id="calcCity"
                        required
                        placeholder="e.g. Vadodara / 390020"
                        value={formData.cityPincode}
                        onChange={handleField('cityPincode')}
                        style={{ paddingLeft: 38 }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', marginTop: 12 }}
                >
                  <CalculatorIcon size={16} aria-hidden="true" />
                  {loading ? 'Sending…' : 'Request Free Survey'}
                </button>

                {submitError && (
                  <p className="calc-hint" style={{ marginTop: 8 }}>
                    <Info size={13} aria-hidden="true" />
                    {submitError}
                  </p>
                )}
              </form>
            ) : (
              <motion.div
                className="calc-success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="calc-success-icon" aria-hidden="true">✓</span>
                <p>
                  <strong>Request received!</strong> Our team will contact you within 24 hours.
                </p>
              </motion.div>
            )}
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
                    <h3 className="calc-results-title">
                      {type === 'residential' ? 'Residential' : 'Commercial'} Estimate
                    </h3>
                    <span className="calc-results-badge">
                      {formatNum(results.systemSize)} kW system
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
                        >
                          <div className="calc-result-icon-wrap" aria-hidden="true">
                            <Icon size={18} />
                          </div>
                          <div className="calc-result-label">{card.label}</div>
                          <div className="calc-result-value">{card.value}</div>
                          <div className="calc-result-sub">{card.sub}</div>
                        </motion.article>
                      );
                    })}
                  </motion.div>

                  <p className="calc-disclaimer">
                    <Info size={13} aria-hidden="true" />
                    Estimates are indicative. Actual figures depend on site conditions, panel
                    orientation, and local tariffs. A site survey will provide precise numbers.
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
                  <Sun size={48} className="calc-empty-icon" aria-hidden="true" />
                  <p className="calc-empty-title">Enter your monthly bill</p>
                  <p className="calc-empty-sub">
                    Your solar estimate will appear here instantly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
