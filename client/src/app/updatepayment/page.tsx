"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetAvailableProductsQuery, useUpdatePaymentMutation } from '@/state/api';

const UpdatePaymentPage = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [success, setSuccess] = useState('');
  const [isSingleSided, setIsSingleSided] = useState(true);

  const { 
    data: products = [], 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useGetAvailableProductsQuery();
  
  const [
    updatePayment, 
    { isLoading: isUpdating, error: updateError }
  ] = useUpdatePaymentMutation();

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.productId === selectedProduct);
  
      if (product) {
        let calculatedTotal = 0;
  
        if (product.LifeProduct?.[0]) {
          calculatedTotal = product.LifeProduct[0].price * quantity;
        } else if (product.StationaryProduct?.[0]) {
          calculatedTotal = product.StationaryProduct[0].price * quantity;
        } else if (product.PhotographyService?.[0]) {
          const servicePrice = product.PhotographyService[0].singleSidePrice;
          calculatedTotal = servicePrice * quantity;
        } else if (product.Publication?.[0]) {
          calculatedTotal = product.Publication[0].price * quantity;
        }
  
        setTotalAmount(calculatedTotal);
        setSearchQuery(product.name);
      }
    }
  }, [selectedProduct, quantity, products]);

  const handleSelectProduct = (productId: string, productName: string) => {
    setSelectedProduct(productId);
    setSearchQuery(productName);
    setShowSuggestions(false);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const product = products.find(p => p.productId === selectedProduct);
    
    if (product && value > product.stockQuantity) {
      setQuantity(product.stockQuantity);
    } else {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const product = products.find(p => p.productId === selectedProduct);
  
      const paymentPayload: {
        productId: string;
        quantity: number;
        totalAmount: number;
        // isSingleSided?: boolean;
      } = {
        productId: selectedProduct,
        quantity,
        totalAmount,
      };
  
      // if (product?.PhotographyService?.[0]) {
      //   paymentPayload.isSingleSided = isSingleSided;
      // }
  
      const result = await updatePayment(paymentPayload).unwrap();
  
      setSuccess(result.message);
      setSelectedProduct('');
      setSearchQuery('');
      setQuantity(1);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error handling is managed by RTK Query
    }
  };

  const error = productsError || updateError;

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#B10F56]" />
      </div>
    );
  }

  return (
    <div className="container min-h-screen py-8 px-4 bg-white text-[#333]">
      <Card className="max-w-3xl mx-auto h-[calc(80vh-4rem)] border-[#B10F56]/20 bg-white shadow-md">
        <CardHeader className="border-b border-[#B10F56]/10">
          <CardTitle className="text-2xl text-[#B10F56]">Update Payment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="product" className="text-[#B10F56]">Search Product</Label>
              <Input
                id="product"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (!e.target.value) {
                    setSelectedProduct('');
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Start typing to search products..."
                className="border-[#B10F56]/20 focus:border-[#B10F56] focus:ring-[#B10F56]/20 bg-white text-[#333]"
              />
              
              {showSuggestions && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md border border-[#B10F56]/20 shadow-lg max-h-96 overflow-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      let price = "";
                      if (product.LifeProduct?.[0]) {
                        price = `$${product.LifeProduct[0].price}`;
                      } else if (product.StationaryProduct?.[0]) {
                        price = `$${product.StationaryProduct[0].price}`;
                      } else if (product.PhotographyService?.[0]) {
                        price = `Single: $${product.PhotographyService[0].singleSidePrice}, Double: $${product.PhotographyService[0].doubleSidePrice}`;
                      } else if (product.Publication?.[0]) {
                        price = `$${product.Publication[0].price}`;
                      }

                      return (
                        <div
                          key={product.productId}
                          className={`p-3 hover:bg-[#B10F56]/10 cursor-pointer transition-colors border-b border-[#B10F56]/10 last:border-b-0 ${
                            product.stockQuantity === 0 ? 'opacity-50' : ''
                          }`}
                          onClick={() => product.stockQuantity > 0 &&
                            handleSelectProduct(product.productId, product.name)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[#B10F56] font-medium">{product.name}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-[#B10F56] font-semibold">{price}</span>
                              <span className="text-[#B10F56]/60 text-sm">
                                Stock: {product.stockQuantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-[#B10F56]/60">No products found</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#B10F56]">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!selectedProduct}
                className="border-[#B10F56]/20 focus:border-[#B10F56] focus:ring-[#B10F56]/20 bg-white text-[#333]"
              />
              {selectedProduct && products.find(p => p.productId === selectedProduct)?.PhotographyService?.[0] && (
                <div className="space-y-2">
                  <Label htmlFor="serviceType" className="text-[#B10F56]">Select Service Type</Label>
                  <select
                    id="serviceType"
                    value={isSingleSided ? "single" : "double"}
                    onChange={(e) => setIsSingleSided(e.target.value === "single")}
                    className="w-full p-2 border border-[#B10F56]/20 rounded-md focus:border-[#B10F56] focus:ring-[#B10F56]/20 bg-white text-[#333]"
                  >
                    <option value="single">Single-Sided</option>
                    <option value="double">Double-Sided</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[#B10F56]">Total Amount</Label>
              <div className="text-2xl font-bold text-[#B10F56]">${totalAmount.toFixed(2)}</div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-500 bg-white text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'An error occurred'}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-[#B10F56]/5 border-[#B10F56]/20 text-[#B10F56]">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#B10F56] hover:bg-[#B10F56]/90 text-white transition-colors"
              disabled={!selectedProduct || quantity < 1 || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Update Payment'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePaymentPage;
