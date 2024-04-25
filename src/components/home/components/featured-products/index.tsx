"use client";

import React, { useState, useEffect } from "react";
import Medusa from "@medusajs/medusa-js";
import { ProductCollection } from "@medusajs/medusa";
import FirstProductRail from "./FirstProductRail";
import SecondProductRail from "./SecondProductRail";
import ThirdProductRail from "./ThirdProductRail";
import CollectionList from "./collection-list";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

type Image = {
  id: string;
  url: string;
};

type Collection = {
  id: string;
  title: string;
};

type Product = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  handle: string;
  collection_name: string;
  images: Image[];
  collection?: Collection; // Optional property
};


interface DashboardItem {
  id: string;
  banner_no: number;
  product_id: string;
  status_visibility: boolean;
  created_at: string;
  updated_at: string;
}

type ProductWrapper = {
  banner_no: number;
  product: Product;
};

type ProductsByBanner = Record<number, ProductWrapper>;

const FeaturedProducts = () => {
  const [productsByBanner, setProductsByBanner] = useState<ProductsByBanner>({});

  useEffect(() => {
    const replaceBaseUrl = (url: string | null | undefined) => {
      const defaultUrl = '';
      const actualUrl = url ?? defaultUrl;
      const localhostBaseUrl = "http://localhost:9000/uploads/";
      const remoteBaseUrl = "http://195.35.20.220:9000/uploads/";
      const newBaseUrl = "https://dhruvcraftshouse.com/backend/uploads/";
      return actualUrl.replace(new RegExp(`^(${localhostBaseUrl}|${remoteBaseUrl})`), newBaseUrl);
    };

    
    const getProductById = async (productId: string): Promise<Product | null> => {
      try {
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.product; // Assuming the product is returned under a 'product' key
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        return null;
      }
    };
    

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/dashboard`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const productFetchPromises = data.dashboardsList.map(async (dashboard: DashboardItem) => {
          const productRes = await getProductById(dashboard.product_id);
          if (!productRes) {
            console.error('Product fetch failed for ID:', dashboard.product_id);
            return null; // Or handle the error as appropriate
          }
        
          // No need to access .product, directly use productRes
          let collectionName = productRes.collection ? productRes.collection.title : 'No Collection';
          if ((dashboard.banner_no === 1 || dashboard.banner_no === 2) && !dashboard.status_visibility) {
            collectionName = "";
          }
        
          return {
            banner_no: dashboard.banner_no,
            product: {
              id: productRes.id,
              title: productRes.title,
              subtitle: productRes.subtitle,
              thumbnail: replaceBaseUrl(productRes.thumbnail),
              description: productRes.description,
              collection_name: collectionName,
              handle: productRes.handle, // Add handle property here
              images: productRes.images ? productRes.images.map((img: Image) => ({
                id: img.id,
                url: replaceBaseUrl(img.url),
              })) : [],
            },
          };
        });
      

        const products = await Promise.all(productFetchPromises);
        const groupedProducts = products.reduce<ProductsByBanner>((acc, productWrapper) => {
          acc[productWrapper.banner_no] = productWrapper;
          return acc;
        }, {});

        setProductsByBanner(groupedProducts);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="mt-8">
      <div>
        {/* Pass first two products to FirstProductRail if they exist */}
        {productsByBanner[1] && productsByBanner[2] && (
          <FirstProductRail products={[productsByBanner[1].product, productsByBanner[2].product]} />
        )}
  
        {/* Pass third product to SecondProductRail if it exists */}
        {productsByBanner[3] && (
          <SecondProductRail product={productsByBanner[3].product} />
        )}
  
        {/* Pass fourth product to ThirdProductRail if it exists */}
        {productsByBanner[4] && (
          <ThirdProductRail product={productsByBanner[4].product} />
        )}
  
        {/* Pass products 5 to 8 to CollectionList if they exist */}
        {productsByBanner[5] && productsByBanner[6] && productsByBanner[7] && productsByBanner[8] && (
          <CollectionList products={[productsByBanner[5].product, productsByBanner[6].product, productsByBanner[7].product, productsByBanner[8].product]} />
        )}
      </div>
    </div>
  );  
};

export default FeaturedProducts;
