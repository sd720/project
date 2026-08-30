import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const GOLD_PRICE_PER_GRAM_24K = 7000;

export default function IntakePortal() {
  const [step, setStep] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    grossWeightGrams: '',
    netWeightGrams: '',
    purityKarat: 22,
    selectedPlanId: ''
  });

  const [applicationResult, setApplicationResult] = useState(null);

  useEffect(() => {
    fetch('/api/v1/loan-schemes')
      .then(res => res.json())
      .then(data => setSchemes(data))
      .catch(err => console.error('Failed to fetch schemes', err));
  }, []);

  const pureGoldWeight = useMemo(() => {
    const net = parseFloat(formData.netWeightGrams) || 0;
    const purity = parseFloat(formData.purityKarat) || 22;
    return net * (purity / 24);
  }, [formData.netWeightGrams, formData.purityKarat]);

  const maxLoanAmount = useMemo(() => {
    return pureGoldWeight * GOLD_PRICE_PER_GRAM_24K * 0.75;
  }, [pureGoldWeight]);

  const validateStep1 = () => {
    if (!formData.customerName || !formData.mobileNumber || !formData.grossWeightGrams || !formData.netWeightGrams) {
      return 'All fields are required.';
    }
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      return 'Mobile number must be 10 digits.';
    }
    if (parseFloat(formData.netWeightGrams) > parseFloat(formData.grossWeightGrams)) {
      return 'Net weight cannot exceed gross weight.';
    }
    return null;
  };

  const nextStep = () => {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.selectedPlanId) {
      return setError('Please select a loan plan.');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        grossWeightGrams: parseFloat(formData.grossWeightGrams),
        netWeightGrams: parseFloat(formData.netWeightGrams),
        purityKarat: parseInt(formData.purityKarat, 10)
      };

      const res = await fetch('/api/v1/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      
      setApplicationResult(data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="steps-indicator">
        <div className={`step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>3</div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="fade-in">
          <h2>Customer & Gold Details</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Enter basic details to calculate your eligibility.</p>
          
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.mobileNumber}
              onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
              placeholder="10-digit number"
            />
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Gross Weight (g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.grossWeightGrams}
                onChange={e => setFormData({...formData, grossWeightGrams: e.target.value})}
                placeholder="Total weight"
              />
            </div>
            <div className="form-group">
              <label>Net Weight (g)</label>
              <input 
                type="number" 
                className="form-control" 
                value={formData.netWeightGrams}
                onChange={e => setFormData({...formData, netWeightGrams: e.target.value})}
                placeholder="Gold weight only"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Gold Purity</label>
            <select 
              className="form-control" 
              value={formData.purityKarat}
              onChange={e => setFormData({...formData, purityKarat: e.target.value})}
            >
              <option value={18}>18 Karat</option>
              <option value={22}>22 Karat (Standard)</option>
              <option value={24}>24 Karat (Pure)</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn" onClick={nextStep}>
              Next <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in">
          <h2>Loan Calculator & Plan Selection</h2>
          
          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-muted">Calculated Pure Gold:</span>
              <strong>{pureGoldWeight.toFixed(2)} g</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">Max Eligible Loan:</span>
              <strong className="text-primary" style={{ fontSize: '1.5rem' }}>{formatCurrency(maxLoanAmount)}</strong>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Select a Repayment Plan</h3>
          <div className="grid grid-2">
            {schemes.map(scheme => (
              <div 
                key={scheme.id}
                className={`card plan-card ${formData.selectedPlanId === scheme.id ? 'active' : ''}`}
                onClick={() => setFormData({...formData, selectedPlanId: scheme.id})}
              >
                <h3>{scheme.name}</h3>
                <p>{scheme.description}</p>
                <div style={{ marginTop: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  {scheme.baseInterestRate}% p.a.
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} onClick={prevStep}>
              <ArrowLeft size={18} /> Back
            </button>
            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading ? <div className="loader" /> : 'Submit Application'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && applicationResult && (
        <div className="fade-in text-center" style={{ padding: '2rem 0' }}>
          <CheckCircle2 size={64} className="text-success" style={{ margin: '0 auto 1.5rem' }} />
          <h2>Application Submitted!</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Your gold loan request has been successfully recorded.</p>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', textAlign: 'left', minWidth: '250px' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="text-muted">Application ID:</span><br/>
              <strong style={{ fontFamily: 'monospace' }}>{applicationResult.applicationId}</strong>
            </div>
            <div>
              <span className="text-muted">Approved Amount:</span><br/>
              <strong className="text-primary" style={{ fontSize: '1.25rem' }}>{formatCurrency(applicationResult.calculatedMaxLoanAmount)}</strong>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button className="btn" onClick={() => window.location.reload()}>
              Start New Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
