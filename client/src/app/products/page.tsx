// Products.tsx
"use client";

import { useCreateProductMutation, useGetProductsQuery, useUpdateProductStockMutation } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductModal from "./CreateProductModal";
import UpdateStockModal from "@/app/(components)/UpdateStockModel";

// Helper functions remain the same
const getPrice = (product: any) => {
  if (product.LifeProduct?.[0]) {
    return `Rs.${product.LifeProduct[0].price}`;
  } else if (product.StationaryProduct?.[0]) {
    return `Rs.${product.StationaryProduct[0].price}`;
  } else if (product.Publication?.[0]) {
    return `Rs.${product.Publication[0].price}`;
  }
  return "N/A";
};

const getProductDetails = (product: any) => {
  if (product.LifeProduct?.[0]) {
    return `${product.LifeProduct[0].type} by ${product.LifeProduct[0].manufacturer}`;
  } else if (product.StationaryProduct?.[0]) {
    return product.StationaryProduct[0].type;
  } else if (product.Publication?.[0]) {
    return `${product.Publication[0].author} - ${product.Publication[0].publisher}`;
  }
  return "";
};

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Product Name", width: 200 },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    renderCell: (params) => getPrice(params.row),
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 110,
    type: "number",
    renderCell: (params) => (params.row.rating ? params.row.rating : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    width: 150,
    type: "number",
  },
  {
    field: "details",
    headerName: "Product Details",
    width: 300,
    renderCell: (params) => getProductDetails(params.row),
  },
];

const Products = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [createProduct] = useCreateProductMutation();
  const [updateProductStock] = useUpdateProductStockMutation();

  const handleCreateProduct = async (productData: any) => {
    try {
      await createProduct(productData);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleRowClick = (params: any) => {
    setSelectedProduct(params.row);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStock = async (updateData: { productId: string; stockQuantity: number }) => {
    try {
      await updateProductStock(updateData);
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  if (isLoading) {
    return <div className="py-4 text-[#B10F56]">Loading...</div>;
  }

  if (isError || !products) {
    return <div className="text-center text-[#B10F56] py-4">Failed to fetch products</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#333]">
      {/* HEADER BAR */}
      <Header name="Products" className="text-[#B10F56] border-b border-[#B10F56]/20" />
      <div className="p-4">
        <button
          className="flex items-center bg-[#B10F56] hover:bg-[#8f0c45] text-white font-bold py-2 px-4 rounded transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Product
        </button>

        {/* DATA GRID */}
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}
          onRowClick={handleRowClick}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-[#B10F56]/20 mt-5"
          sx={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '& .MuiDataGrid-main': {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'white',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              textShadow: '0px 1px 1px rgba(0,0,0,0.1)',
              '& .MuiDataGrid-columnHeader': {
                outline: 'none',
                '&:focus': {
                  outline: 'none'
                }
              },
              '& .MuiDataGrid-columnSeparator': {
                color: 'rgba(177, 15, 86, 0.2)',
              }
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: '#B10F56',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(177, 15, 86, 0.2)',
              fontWeight: 450,
              fontSize: '0.9rem',
              color: '#2D3748',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: '1.5',
              padding: '12px 16px',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#FDE7EF',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            },
            '& .MuiCheckbox-root': {
              color: '#B10F56',
              '&.Mui-checked': {
                color: '#B10F56',
              }
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f7f7f7',
              borderTop: '1px solid rgba(177, 15, 86, 0.2)',
              fontWeight: 450,
              color: '#2D3748',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: '#FDE7EF',
              '&:hover': {
                backgroundColor: '#FBDAE5',
              },
            },
          }}
        />
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      <UpdateStockModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        product={selectedProduct}
        onUpdate={handleUpdateStock}
      />
    </div>
  );
};

export default Products;