import React, { useState } from 'react';
import Header from "@/app/(components)/Header";

const UpdateStockModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onUpdate 
}) => {
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 0);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      productId: product.productId,
      stockQuantity: parseInt(stockQuantity)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={`Update Stock: ${product.name}`} />
        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Current Stock: {product.stockQuantity}
          </label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="block w-full mt-2 p-2 border-gray-500 border-2 rounded-md"
            min="0"
            required
          />
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockModal;