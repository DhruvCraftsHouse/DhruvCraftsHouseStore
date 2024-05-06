import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useProductPrice from "@/lib/hooks/use-product-price";
import ProductPreview from "@/components/products/components/product-preview";
import clsx from 'clsx';
import Thumbnail from '@/components/products/components/thumbnail';
import { Text } from '@medusajs/ui';
import Product from 'medusa-react'
import Link from "next/link"
import { MEDUSA_BACKEND_URL } from '@/lib/config';


// Define a type for the props
type ProductWithPriceProps = {
  productId: string;
};
// Define a type for the fetched product details
type ProductDetailsType = {
    title: string;
    handle: string;
    thumbnail: string;
    buy_get_num: number;
    buy_get_offer: number;
    sales_quantity: number;
    // ... add other details you need
  };

export const ProductWithPrice: React.FC<ProductWithPriceProps> = ({ productId }) => {
    const [productDetails, setProductDetails] = useState<ProductDetailsType | null>(null);
    const price = useProductPrice({ id: productId });
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products/${productId}`);
          const product = response.data.product;
          setProductDetails({
            title: product.title,
            handle: product.handle,
            thumbnail: product.thumbnail,
            buy_get_num: product.buy_get_num,
            buy_get_offer: product.buy_get_offer,
            sales_quantity: product.sales_quantity
            // ... set other details from the response
          });
        } catch (error) {
          console.error('Error fetching product details:', error);
          // Handle error here, e.g., show an error notification
        }
      };
  
      fetchProductDetails();
    }, [productId]);
  
    const selectedPrice = useMemo(() => {
      const { variantPrice, cheapestPrice } = price;
      return variantPrice || cheapestPrice || null;
    }, [price]);

    const transformThumbnailUrl = (url: string | null): string => {
      if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
      return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
    };
    // console.log('productDetails', productDetails)

    return (
      <>
        {productDetails && (
          <Link href={`/products/${productDetails.handle}`} className="group">
            <div style={{ fontFamily: "Klein,sans-serif" }}>
              <Thumbnail thumbnail={transformThumbnailUrl(productDetails.thumbnail)} size="full" />
              <div className="flex flex-col mt-4 justify-between">
                <div>
                  <Text className="truncate" style={{ fontWeight: 600, color: "black", fontSize: "15px", textTransform: "uppercase", fontFamily: "Klein, sans-serif" }}>
                    {productDetails.title}
                  </Text>
                </div>
                <div>
                {productDetails.sales_quantity > 5 &&(
      <p style={{color:"red", fontSize:"12px", fontWeight: 600}}>BESTSELLER</p>
      )}
                </div>
                <div className="flex items-center gap-x-2">
                  {selectedPrice ? (
                    <>
                      {selectedPrice.price_type === "sale" && (
                        <Text className="line-through text-black-900" style={{ fontWeight: 500, fontSize: "20px" }}>
                          {selectedPrice.original_price}
                        </Text>
                      )}
                      <Text
                        style={{ fontWeight: 500, fontSize: "20px" }}
                        className={clsx("text-black-900", {
                          "text-rose-600": selectedPrice.price_type === "sale",
                        })}
                      >
                        {selectedPrice.calculated_price}
                      </Text>
                    </>
                  ) : (
                    <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
                  )}
                </div>
               
                <div>
                {productDetails.buy_get_num && productDetails.buy_get_offer && (
        <div>
          <p style={{color:"green", letterSpacing:"-0.05em"}}>Buy {productDetails.buy_get_num} Get {productDetails.buy_get_offer} % Offer</p>
        </div>
      )}
                </div>
              </div>
            </div>
            <style>
              {`
              .truncate {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                fontSize: 10px;
              }
              `}
            </style>
          </Link>
        )}
      </>
    );
            }