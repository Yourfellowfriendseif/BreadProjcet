// src/components/CreateBreadForm.jsx
import { useState } from 'react';
import { breadAPI } from '../../api/breadAPI';

export default function CreateBreadForm() {
  const [formData, setFormData] = useState({
    post_type: 'sell',
    bread_status: 'day_old',
    photo_url: '',
    quantity: 1,
    location: { lng: 0, lat: 0 }
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await breadAPI.create(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Creation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={formData.post_type}
        onChange={(e) => setFormData({...formData, post_type: e.target.value})}
      >
        <option value="sell">Selling</option>
        <option value="request">Looking For</option>
      </select>

      <select
        value={formData.bread_status}
        onChange={(e) => setFormData({...formData, bread_status: e.target.value})}
      >
        <option value="fresh">Fresh</option>
        <option value="day_old">Day Old</option>
        <option value="stale">Stale</option>
      </select>

      <input
        type="number"
        value={formData.quantity}
        onChange={(e) => setFormData({...formData, quantity: +e.target.value})}
        min="1"
      />

      {/* Location picker would go here */}
      
      {success && <div className="success">Post created!</div>}
      <button type="submit">Submit</button>
    </form>
  );
}