"use client";

import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const getPrice = (product) => {
  if (product.LifeProduct?.[0]) {
    return `Rs.${product.LifeProduct[0].price}`;
  } else if (product.StationaryProduct?.[0]) {
    return `Rs.${product.StationaryProduct[0].price}`;
  } else if (product.Publication?.[0]) {
    return `Rs.${product.Publication[0].price}`;
  }
  return "N/A";
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
];

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <div className="py-4 text-[#B10F56]">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-[#B10F56] py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#333]">
      <Header name="Inventory" className="text-[#B10F56] border-b border-[#B10F56]/20" />
      <div className="p-4">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-[#B10F56]/20 mt-5"
          sx={{
            // Global font family
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            '& .MuiDataGrid-main': {
              // Improve text rendering
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
              fontWeight: 450, // Slightly increased for better readability
              fontSize: '0.9rem',
              color: '#2D3748', // More sophisticated dark gray
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
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            '& .MuiTablePagination-root': {
              color: '#2D3748',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    </div>
  );
};

export default Inventory;