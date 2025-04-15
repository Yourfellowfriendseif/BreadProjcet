// src/components/BreadList.jsx
import { useEffect, useState } from "react";
import { breadAPI } from "../../api/breadAPI";

/**
 * @typedef {import('../../types/dbTypes').BreadPost} BreadPost
 */

export default function BreadList() {
  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBreads = async () => {
      try {
        const data = await breadAPI.getAll();
        if (data) {
          console.log("Fetched breads:", data);
          setBreads(data);
        } else {
          console.error("No data received from breadAPI");
          setError("No data received from server");
        }
      } catch (err) {
        console.error("Error fetching breads:", err);
        setError("Failed to load bread listings");
      } finally {
        // Add a delay of 2 seconds before setting loading to false
        await new Promise(resolve => setTimeout(resolve, 2000));
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
          <h3>
            {bread.user.username}'s {bread.post_type}
          </h3>
          <p>Status: {bread.bread_status}</p>
          <p>Quantity: {bread.quantity}</p>
        </div>
      ))}
    </div>
  );
}
