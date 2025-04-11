// src/components/BreadList.jsx
import { useEffect, useState } from 'react';
import { breadAPI } from '../../api/breadAPI';

/**
 * @typedef {import('../../types/dbTypes').BreadPost} BreadPost
 */

export default function BreadList() {
  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBreads = async () => {
      try {
        const data = await breadAPI.getAll();
        setBreads(data);
      } catch (err) {
        setError('Failed to load bread listings');
      } finally {
        setLoading(false);
      }
    };
    loadBreads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bread-grid">
      {breads.map((/** @type {BreadPost} */ bread) => (
        <div key={bread._id} className="bread-card">
          <img src={bread.photo_url} alt={bread.post_type} />
          <h3>{bread.user.username}'s {bread.post_type}</h3>
          <p>Status: {bread.bread_status}</p>
          <p>Quantity: {bread.quantity}</p>
        </div>
      ))}
    </div>
  );
}