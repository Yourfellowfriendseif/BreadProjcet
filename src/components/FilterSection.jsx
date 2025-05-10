import React, { useState } from 'react';
import './FilterSection.css';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira',
  'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda',
  'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 'M-Sila', 'Mascara', 'Ouargla',
  'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'
];

const STATUS_OPTIONS = ['All Status', 'Fresh', 'Stale', 'Day Old'];
const TYPE_OPTIONS = ['All Types', 'Baguette', 'Khobz', 'Msemen', 'Kesra', 'Other'];

export default function FilterSection({ filters, setFilters, onApply, onReset, animated }) {
  const [open, setOpen] = useState(true);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ status: '', type: '', province: '' });
    if (onReset) onReset();
  };

  const handleApply = () => {
    if (onApply) onApply();
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
                <select name="status" value={filters.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt === 'All Status' ? '' : opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label>Type of Bread</label>
                <select name="type" value={filters.type} onChange={handleChange}>
                  {TYPE_OPTIONS.map(opt => <option key={opt} value={opt === 'All Types' ? '' : opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label>Province</label>
                <select name="province" value={filters.province} onChange={handleChange}>
                  <option value="">All Provinces</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
            <div className="filter-card-actions">
              <button className="filter-btn filter-btn-outline" onClick={handleReset}>Reset</button>
              <button className="filter-btn filter-btn-primary" onClick={handleApply}>Apply Filters</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 