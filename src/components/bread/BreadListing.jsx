import { useState } from "react";
import BreadItem from "./BreadItem";
import './BreadListing.css';
import PostDetailsModal from './PostDetailsModal';

export default function BreadListingPage({ posts = [], onUpdate }) {
  const [modalPost, setModalPost] = useState(null);

  const handleUpdate = (action, post) => {
    if (action === 'viewDetails') {
      setModalPost(post);
    }
    if (onUpdate) onUpdate(action, post);
  };

  // Deduplicate posts by _id
  const uniqueBreads = posts.filter(
    (post, idx, arr) => arr.findIndex(p => p._id === post._id) === idx
  );

  return (
    <>
    <div className="bread-listing-container">
        {uniqueBreads.length === 0 ? (
        <div className="bread-listing-empty">No bread posts available.</div>
      ) : (
          uniqueBreads.map((bread) => (
            <BreadItem key={bread._id} post={bread} onUpdate={handleUpdate} />
        ))
      )}
        {modalPost && (
          <PostDetailsModal post={modalPost} onClose={() => setModalPost(null)} />
        )}
    </div>
      {/* Pagination controls will go here */}
    </>
  );
}