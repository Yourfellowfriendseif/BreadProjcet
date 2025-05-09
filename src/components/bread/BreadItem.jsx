import React from 'react';
import './BreadItem.css';

const BreadListing = ({ post, onUpdate }) => {
  return (
    <div className="bread-item">
      <h3 className="bread-item-title">{post.title}</h3>
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title} 
          className="bread-item-image"
        />
      )}
      <p className="bread-item-description">{post.description}</p>
      <div className="bread-item-location">
        <span>Location: {post.location}</span>
      </div>
    </div>
  );
};

export default BreadListing;