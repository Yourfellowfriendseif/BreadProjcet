import React from 'react';

const BreadListing = ({ post, onUpdate }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{post.title}</h3>
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-48 object-cover rounded-md my-2"
        />
      )}
      <p className="text-gray-600">{post.description}</p>
      <div className="mt-2">
        <span className="text-sm text-gray-500">Location: {post.location}</span>
      </div>
    </div>
  );
};

export default BreadListing;