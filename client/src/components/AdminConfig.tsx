import React, { useState, useEffect } from 'react';
import { Plus, FileCode, CheckCircle, AlertTriangle } from 'lucide-react';

interface AdminConfigProps {
  onConfigChanged: () => void;
}

export default function AdminConfig({ onConfigChanged }: AdminConfigProps) {
  const [jsonConfig, setJsonConfig] = useState<any>(null);
  
  // Treatment Form state
  const [treatmentForm, setTreatmentForm] = useState({
    name: '',
    departmentId: 'skin',
    description: '',
    duration: '45 mins',
    recoveryTime: 'Immediate',
    cost: '',
    safetyInfo: 'Safe for all skin types. Wear sunscreen post treatment.',
    keywords: ''
  });

  // FAQ Form state
  const [faqForm, setFaqForm] = useState({
    category: 'General',
    question: '',
    answer: ''
  });

  const [tStatus, setTStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [fStatus, setFStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Fetch config layout to preview JSON contents
  const fetchCurrentConfig = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/services');
      if (res.ok) {
        const data = await res.json();
        setJsonConfig(data);
      }
    } catch (e) {
      console.error('Failed to reload json database preview:', e);
    }
  };

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const handleAddTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTStatus(null);

    const costNum = Number(treatmentForm.cost);
    if (!treatmentForm.name || isNaN(costNum) || costNum <= 0 || !treatmentForm.description) {
      setTStatus({ type: 'error', msg: 'Please provide valid values for Name, Cost, and Description.' });
      return;
    }

    try {
      const kwArray = treatmentForm.keywords
        ? treatmentForm.keywords.split(',').map(k => k.trim())
        : [treatmentForm.name.toLowerCase()];

      const res = await fetch('http://localhost:5000/api/admin/treatments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...treatmentForm,
          cost: costNum,
          keywords: kwArray
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTStatus({ type: 'success', msg: `Added treatment: "${data.treatment.name}" successfully!` });
        setTreatmentForm({
          name: '',
          departmentId: 'skin',
          description: '',
          duration: '45 mins',
          recoveryTime: 'Immediate',
          cost: '',
          safetyInfo: 'Safe for all skin types. Wear sunscreen post treatment.',
          keywords: ''
        });
        fetchCurrentConfig();
        onConfigChanged();
      } else {
        setTStatus({ type: 'error', msg: data.error || 'Failed to save treatment.' });
      }
    } catch (err) {
      setTStatus({ type: 'error', msg: 'Network error communicating with admin API.' });
    }
  };

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setFStatus(null);

    if (!faqForm.question || !faqForm.answer) {
      setFStatus({ type: 'error', msg: 'Question and Answer are required.' });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      });

      const data = await res.json();
      if (res.ok) {
        setFStatus({ type: 'success', msg: 'FAQ entry successfully added!' });
        setFaqForm({
          category: 'General',
          question: '',
          answer: ''
        });
        fetchCurrentConfig();
        onConfigChanged();
      } else {
        setFStatus({ type: 'error', msg: data.error || 'Failed to save FAQ.' });
      }
    } catch (err) {
      setFStatus({ type: 'error', msg: 'Network error communicating with admin FAQ API.' });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
      
      {/* Forms Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Treatment Form Card */}
        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: 'var(--color-primary)' }} />
            Add Clinic Treatment
          </h2>
          
          {tStatus && (
            <div style={{ 
              background: tStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
              color: tStatus.type === 'success' ? 'var(--color-primary)' : '#ef4444', 
              padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {tStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {tStatus.msg}
            </div>
          )}

          <form onSubmit={handleAddTreatment} id="add-treatment-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-name">Treatment Name</label>
                <input 
                  type="text" 
                  id="admin-t-name"
                  className="form-input" 
                  placeholder="e.g. Skin Whitening Facial"
                  value={treatmentForm.name}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-dept">Department</label>
                <select
                  id="admin-t-dept"
                  className="form-input"
                  value={treatmentForm.departmentId}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, departmentId: e.target.value }))}
                >
                  <option value="dental">Dental</option>
                  <option value="skin">Skin</option>
                  <option value="hair">Hair</option>
                  <option value="laser">Laser</option>
                  <option value="cosmetic">Cosmetic Procedures</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-duration">Duration</label>
                <input 
                  type="text" 
                  id="admin-t-duration"
                  className="form-input" 
                  placeholder="e.g. 45 minutes"
                  value={treatmentForm.duration}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, duration: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-downtime">Downtime / Recovery</label>
                <input 
                  type="text" 
                  id="admin-t-downtime"
                  className="form-input" 
                  placeholder="e.g. 1-2 days"
                  value={treatmentForm.recoveryTime}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, recoveryTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-cost">Cost ($ USD)</label>
                <input 
                  type="number" 
                  id="admin-t-cost"
                  className="form-input" 
                  placeholder="e.g. 250"
                  value={treatmentForm.cost}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, cost: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-t-keywords">Keywords (Comma separated)</label>
                <input 
                  type="text" 
                  id="admin-t-keywords"
                  className="form-input" 
                  placeholder="e.g. glow, whitening, dullness, spot"
                  value={treatmentForm.keywords}
                  onChange={(e) => setTreatmentForm(p => ({ ...p, keywords: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-t-desc">Description</label>
              <textarea 
                id="admin-t-desc"
                className="form-input" 
                style={{ minHeight: '60px' }}
                placeholder="Briefly describe what this treatment does..."
                value={treatmentForm.description}
                onChange={(e) => setTreatmentForm(p => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-t-safety">Safety Warnings</label>
              <input 
                type="text" 
                id="admin-t-safety"
                className="form-input" 
                value={treatmentForm.safetyInfo}
                onChange={(e) => setTreatmentForm(p => ({ ...p, safetyInfo: e.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Add Treatment to services.json
            </button>
          </form>
        </section>

        {/* FAQ Form Card */}
        <section className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: 'var(--color-primary)' }} />
            Add Clinic FAQ
          </h2>

          {fStatus && (
            <div style={{ 
              background: fStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
              color: fStatus.type === 'success' ? 'var(--color-primary)' : '#ef4444', 
              padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              {fStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {fStatus.msg}
            </div>
          )}

          <form onSubmit={handleAddFAQ} id="add-faq-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-f-cat">Category</label>
                <select
                  id="admin-f-cat"
                  className="form-input"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="General">General</option>
                  <option value="Bookings">Bookings</option>
                  <option value="Dental">Dental</option>
                  <option value="Skin">Skin</option>
                  <option value="Hair">Hair</option>
                  <option value="Laser">Laser</option>
                  <option value="Cosmetic">Cosmetic</option>
                  <option value="Payments">Payments</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                {/* Empty block to align layout cleanly */}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-f-q">Question</label>
              <input 
                type="text" 
                id="admin-f-q"
                className="form-input" 
                placeholder="e.g. Do you have emergency dental slots?"
                value={faqForm.question}
                onChange={(e) => setFaqForm(p => ({ ...p, question: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-f-a">Answer</label>
              <textarea 
                id="admin-f-a"
                className="form-input" 
                style={{ minHeight: '60px' }}
                placeholder="Detailed answer response..."
                value={faqForm.answer}
                onChange={(e) => setFaqForm(p => ({ ...p, answer: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Add FAQ to services.json
            </button>
          </form>
        </section>

      </div>

      {/* JSON File Preview Code Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', height: '100%' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode size={16} style={{ color: 'var(--color-primary)' }} />
            Active services.json Schema
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Adding treatments or FAQs above will rewrite the server-side configuration dynamically. The catalog and chatbot instantly adapt without code modifications or rebuilding.
          </p>
          {jsonConfig ? (
            <pre className="admin-json-preview" id="admin-json-view">
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Loading database schema preview...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
