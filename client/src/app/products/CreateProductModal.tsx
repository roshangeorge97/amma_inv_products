import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

type BaseProductData = {
  name: string;
  category: 'LIFE_PRODUCTS' | 'STATIONARY' | 'PHOTOGRAPHY' | 'PUBLICATIONS';
  stockQuantity: number;
  rating: number;
};

type LifeProductData = BaseProductData & {
  price: number;
  type: string;
  manufacturer: string;
  expiryDate?: string;
};

type StationaryProductData = BaseProductData & {
  price: number;
  type: string;
};

type PhotographyServiceData = BaseProductData & {
  singleSidePrice: number;
  doubleSidePrice: number;
  serviceType: string;
};

type PublicationProductData = BaseProductData & {
  price: number;
  author: string;
  publisher: string;
  isbn: string;
};

type ProductFormData = LifeProductData | StationaryProductData | PhotographyServiceData | PublicationProductData;

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [category, setCategory] = useState<BaseProductData['category']>('LIFE_PRODUCTS');
  const [baseFormData, setBaseFormData] = useState<BaseProductData>({
    name: "",
    category: 'LIFE_PRODUCTS',
    stockQuantity: 0,
    rating: 0,
  });

  const [specificFormData, setSpecificFormData] = useState<any>({
    price: 0,
    type: '',
    manufacturer: '',
    expiryDate: '',
    author: '',
    publisher: '',
    isbn: '',
  });

  const handleBaseChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBaseFormData({
      ...baseFormData,
      [name]: name === "stockQuantity" || name === "rating"
        ? parseFloat(value)
        : value,
    });

    if (name === 'category') {
      setCategory(value as BaseProductData['category']);
    }
  };

  const handleSpecificChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpecificFormData({
      ...specificFormData,
      [name]: ['price'].includes(name)
        ? parseFloat(value)
        : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate productId here
    const productId = uuidv4(); // Generate a unique ID for the product
    
    const formData = {
      ...baseFormData,
      ...specificFormData,
      productId, // Add productId to the formData
    };
    
    onCreate(formData as ProductFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-[#B10F56]">Create New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2D3748] font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                className="w-full border border-[#B10F56]/20 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#B10F56]/50"
                value={baseFormData.name}
                onChange={handleBaseChange}
                required
              />
            </div>
            <div>
              <label className="block text-[#2D3748] font-medium">Category</label>
              <select
                name="category"
                className="w-full border border-[#B10F56]/20 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#B10F56]/50"
                value={baseFormData.category}
                onChange={handleBaseChange}
                required
              >
                <option value="LIFE_PRODUCTS">Life Products</option>
                <option value="STATIONARY">Stationary</option>
                <option value="PUBLICATIONS">Publications</option>
              </select>
            </div>

            {/* Specific data based on category */}
            {category === 'LIFE_PRODUCTS' && (
              <>
                <div>
                  <label className="block text-[#2D3748] font-medium">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full border border-[#B10F56]/20 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#B10F56]/50"
                    value={specificFormData.price}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type</label>
                  <input
                    type="text"
                    name="type"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.type}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.manufacturer}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
              </>
            )}

            {category === 'STATIONARY' && (
              <>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.price}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Type</label>
                  <input
                    type="text"
                    name="type"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.type}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
              </>
            )}

            {category === 'PUBLICATIONS' && (
              <>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.price}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Author</label>
                  <input
                    type="text"
                    name="author"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.author}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.publisher}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={specificFormData.isbn}
                    onChange={handleSpecificChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#B10F56] hover:bg-[#8f0c45] text-white rounded-md p-2 transition duration-200 font-medium"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
