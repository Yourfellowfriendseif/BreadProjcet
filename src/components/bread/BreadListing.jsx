import { useEffect, useState } from "react";
import { breadAPI } from "../../api/breadAPI";
import BreadItem from "./BreadItem";
import './BreadListing.css';

export default function BreadListingPage() {
  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBreads = async () => {
    try {
      const response = await breadAPI.getAll();
      setBreads(response.data.posts);
    } catch (err) {
      setError("Failed to load bread listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBreads();
  }, []);

  if (loading) return <div className="bread-listing-loading">Loading...</div>;
  if (error) return <div className="bread-listing-error">{error}</div>;

  return (
    <div className="bread-listing-container">
      {breads.length === 0 ? (
        <div className="bread-listing-empty">No bread posts available.</div>
      ) : (
        breads.map((bread) => (
          <BreadItem key={bread._id} post={bread} onUpdate={loadBreads} />
        ))
      )}
    </div>
  );
}