import { useEffect, useState } from "react";
import { breadAPI } from "../../api/breadAPI";
import BreadListing from "./BreadListing";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {breads.length === 0 ? (
        <div>No bread posts available.</div>
      ) : (
        breads.map((bread) => (
          <BreadListing key={bread._id} post={bread} onUpdate={loadBreads} />
        ))
      )}
    </div>
  );
}