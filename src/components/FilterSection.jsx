import React, { useState } from 'react';
import './FilterSection.css';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M-Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'day_old', label: 'Day Old' },
  { value: 'stale', label: 'Stale' }
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'sell', label: 'For Sale' },
  { value: 'request', label: 'Request' }
];

export default function FilterSection({ filters, setFilters, onApply, onReset, animated }) {
  const [open, setOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters({ status: '', type: '', province: '' });
    if (onReset) onReset();
  };

  const handleApply = () => {
    // Clean up filters by removing empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    if (onApply) onApply(cleanFilters);
  };

  return (
    <div className="filter-card">
      <div className="filter-card-header">
        <span>Filter Products</span>
        <button
          className={`filter-toggle-btn${open ? ' open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Collapse filters' : 'Expand filters'}
        >
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>
      <div
        className={`filter-card-content${animated ? ' animated' : ''}`}
        style={animated ? {
          maxHeight: open ? 500 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)'
        } : {}}
      >
        {open && (
          <>
            <div className="filter-controls-grid">
              <div>
                <label>Status</label>
                <select 
                  name="status" 
                  value={filters.status} 
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Post Type</label>
                <select 
                  name="post_type" 
                  value={filters.post_type} 
                  onChange={handleChange}
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Province</label>
                <select 
                  name="province" 
                  value={filters.province} 
                  onChange={handleChange}
                >
                  <option value="">All Provinces</option>
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-card-actions">
              <button 
                className="filter-btn filter-btn-outline" 
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className="filter-btn filter-btn-primary" 
                onClick={handleApply}
              >
                Apply Filters
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 