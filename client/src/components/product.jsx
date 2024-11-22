import React from 'react';

export const ProductDetails = ({ product }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.title}</h1>

        {/* Brand and Price */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">Brand: <span className="font-medium text-gray-700">{product.brand}</span></p>
          <p className="text-sm text-gray-500">
            Price: <span className="font-medium text-gray-700">{product.price ? `$${product.price}` : 'Not available'}</span>
          </p>
        </div>

        {/* Colors */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Available Colors:</h3>
          <div className="flex gap-2 mt-2">
            {product.color.map((color, index) => (
              <span
                key={index}
                className="inline-block px-4 py-2 bg-gray-200 text-sm font-medium text-gray-700 rounded-md shadow-sm"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        {/* About This Item */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">About This Item:</h3>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            {product.aboutThisItem.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Uses */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recommended Uses:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.recommended_use_for.map((use, index) => (
              <span
                key={index}
                className="inline-block px-4 py-2 bg-blue-100 text-sm font-medium text-blue-700 rounded-md"
              >
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Categories:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.product_categories.map((category, index) => (
              <span
                key={index}
                className="inline-block px-4 py-2 bg-green-100 text-sm font-medium text-green-700 rounded-md"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Product Highlights */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Product Highlights:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Object.entries(product.product_highlights).map(([key, value], index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-700 capitalize">{key.replace('_', ' ')}:</p>
                <p className="text-sm text-gray-600">
                  {Array.isArray(value) ? value.join(', ') : value || 'Not specified'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
          <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

