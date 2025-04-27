import { useEffect, useState } from "react";
import { breadAPI } from "../../api/breadAPI";

export default function BreadList() {
  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
          <div key={bread._id} className="border rounded-lg overflow-hidden shadow">
            <div className="h-48 overflow-hidden">
              {bread.imageIds?.length > 0 ? (
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}/api/upload/${bread.imageIds[0]}`} 
                  alt={bread.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{bread.description}</h3>
              <p>Type: {bread.post_type === 'sell' ? 'For Sale' : 'Wanted'}</p>
              <p>Status: {bread.status}</p>
              <p>Category: {bread.category}</p>
              <p>Quantity: {bread.quantity}</p>
              {bread.user && (
                <p className="text-sm text-gray-600">Posted by: {bread.user.username}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}