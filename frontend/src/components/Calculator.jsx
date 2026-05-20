import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalculatorIcon, Info, MapPin, PanelTop, Phone, User, Wallet, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { calculatorResults } from '../data/siteData';
import { sectionMotion, staggerContainer, staggerItem, hoverLift } from '../utils/motion';
import { calculateSolarEstimate } from '../utils/api';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(value);
}

export default function Calculator() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cityPincode: '',
    monthlyBill: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback local calculation if backend fails
  const billValue = Number(formData.monthlyBill) || 0;
  const systemSize = Math.max(1.5, billValue / (calculatorResults.averageTariff * calculatorResults.solarYieldPerKw));
  const totalCost = systemSize * calculatorResults.baseCostPerKw;
  const savings = billValue * 0.9;
  const yearlySavings = savings * 12;

  // Use backend results if available, otherwise use local calculations
  const displayResults = results || {
    systemSize,
    totalCost,
    monthlySavings: savings,
    yearlySavings,
  };

  const resultItems = [
    {
      label: 'System Size',
      value: `${formatNumber(displayResults.systemSize)} kW`,
      icon: PanelTop,
      toneClass: 'calculator-result-value--primary',
    },
    {
      label: 'Estimated Cost',
      value: formatCurrency(displayResults.totalCost),
      icon: Wallet,
    },
    {
      label: 'Monthly Savings',
      value: formatCurrency(displayResults.monthlySavings),
      icon: Zap,
      toneClass: 'calculator-result-value--primary',
    },
    {
      label: 'Annual Savings',
      value: formatCurrency(displayResults.yearlySavings),
      icon: Wallet,
      toneClass: 'calculator-result-value--accent',
    },
  ];

  const handleFieldChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.phone || !formData.cityPincode || !formData.monthlyBill) {
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const payload = {
      pincode: formData.cityPincode,
      monthlyElectricityBill: parseFloat(formData.monthlyBill),
    };

    const result = await calculateSolarEstimate(payload);

    setLoading(false);

    if (result.success) {
      // Extract estimate data from backend response
      const estimate = result.data.estimate || result.data;
      const systemSize = estimate.systemSizeKw || estimate.systemSize;
      
      setResults({
        systemSize: systemSize,
        totalCost: estimate.totalCost,
        monthlySavings: estimate.monthlySavings,
        yearlySavings: estimate.yearlySavings,
      });
      setShowResults(true);
    } else {
      // Show error but still display local calculation as fallback
      setError('Could not connect to calculator. Showing estimated values.');
      setShowResults(true);
    }
  };

  return (
    <motion.section className="section" {...sectionMotion}>
      <div className="container">
        <SectionHeading
          eyebrow="Calculator"
          title="Estimate your solar savings in a few seconds"
          copy="This production-ready front-end calculator uses a clear local model to estimate system size, cost, savings, and payback period."
        />

        <motion.div className="form-card calculator-card" {...hoverLift}>
          <form className="form-grid calculator-form" onSubmit={handleSubmit}>
            <div className="stack" style={{ marginBottom: 6 }}>
              <h3 className="service-card__title" style={{ marginBottom: 4 }}>
                Step 1: User Details
              </h3>
              <p className="text-muted">Enter details first, then calculate your estimated savings.</p>
            </div>

            <div className="form-grid form-grid--2">
              <div className="field">
                <label htmlFor="calcName">Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input id="calcName" required value={formData.name} onChange={handleFieldChange('name')} style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="calcPhone">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input id="calcPhone" required type="tel" value={formData.phone} onChange={handleFieldChange('phone')} style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="calcCity">City / Pincode</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input id="calcCity" required value={formData.cityPincode} onChange={handleFieldChange('cityPincode')} style={{ paddingLeft: 40 }} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="calcBill">Monthly Electricity Bill (INR)</label>
                <div style={{ position: 'relative' }}>
                  <Wallet size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    id="calcBill"
                    required
                    type="number"
                    min="0"
                    value={formData.monthlyBill}
                    onChange={handleFieldChange('monthlyBill')}
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 4, display: 'grid', gap: 14 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <CalculatorIcon size={16} />
                {loading ? 'Calculating...' : 'Calculate Savings'}
              </button>
              {error ? (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.92rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Info size={16} />
                  {error}
                </p>
              ) : (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.92rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Info size={16} />
                  Results are approximate and should be confirmed with a site survey.
                </p>
              )}
            </div>
          </form>

          {showResults ? (
            <motion.div
              className="calculator-results-wrap"
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h3 className="service-card__title" style={{ marginBottom: 16 }}>
                Step 2: Estimated Results
              </h3>

              <motion.div className="calculator-results-grid" variants={staggerContainer} initial="hidden" animate="show">
                {resultItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.article key={item.label} className="panel calculator-result-card" variants={staggerItem}>
                      <div className="stack-item__icon" style={{ marginBottom: 10 }}>
                        <Icon size={18} />
                      </div>
                      <div className="calculator-result-label">{item.label}</div>
                      <div className={`calculator-result-value ${item.toneClass ?? ''}`}>{item.value}</div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  );
}
