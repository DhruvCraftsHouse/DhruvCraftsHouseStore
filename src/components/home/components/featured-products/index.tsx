"use client";

import { ProductCollection } from "@medusajs/medusa"
import ProductRail from "./product-rail"
import FirstProductRail from "./FirstProductRail";
import CollectionList from "./collection-list"
// import SecondProductRail from "./second-product-rail";
import SecondProductRail from "./SecondProductRail";
// import ThirdProductRail from "./third-product-rail";
import ThirdProductRail from "./ThirdProductRail";
import Medusa from "@medusajs/medusa-js";
import React, { useState, useEffect } from "react";
import { MEDUSA_BACKEND_URL } from "@/lib/config";


const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

type Image = {
  id: string;
  url: string;
};

type Product = {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  collection_name: string;
  images: Image[]; // Add this line
};

// Define static products
const staticProducts = [
  {
    id: "1",
    title: "Handcrafted Krishna",
    subtitle: "with the flute",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712734040539-DSC00930.JPG",
    description: "Exquisite handcrafted Krishna statue made from fine materials.",
    collection_name: "Spiritual Decor",
    images: [
      { id: "img1", url: "https://example.com/images/product1.jpg" },
      { id: "img2", url: "https://example.com/images/product1_alt.jpg" },
    ]
  },
  {
    id: "2",
    title: "Handcrafted Duck",
    subtitle: "",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712734707835-DSC00894.JPG",
    description: "A set of three elegant candle holders in different sizes.",
    collection_name: "Home Essentials",
    images: [
      { id: "img1", url: "https://example.com/images/product2.jpg" },
      { id: "img2", url: "https://example.com/images/product2_alt.jpg" },
    ]
  },
  {
    id: "3",
    title: "Rajasthani Musician",
    subtitle: "Folk Dance And Storytelling",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712608866338-violinman.png",
    description: "Rajasthani music is about using beautiful rhythm and words to lyrically describe their love for the forest, animals, water, everyday life.",
    collection_name: "Modern Decor",
    images: [
      { id: "img1", url: "https://example.com/images/product3.jpg" },
      { id: "img2", url: "https://example.com/images/product3_alt.jpg" },
    ]
  },
  {
    id: "4",
    title: "BRASS GANESHA WITH STONE WORK",
    subtitle: "Beauty Sleep",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00774.JPG",
    description: "Luxury silk pillowcase to enhance your beauty sleep.",
    collection_name: "Bedroom Essentials",
    images: [
      { id: "img1", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984889-DSC00975.JPG" },
      { id: "img2", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00773.JPG", },
      { id: "img3", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00774.JPG", },
      { id: "img4", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00504 copy.jpg", },
      { id: "img4", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00504 copy.jpg", },

    ]
  }
];


// Define static products
const collectionProducts = [
  {
    id: "1",
    title: "Handcrafted Krishna",
    subtitle: "with the flute",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712734040539-DSC00930.JPG",
    description: "Exquisite handcrafted Krishna statue made from fine materials.",
    collection_name: "Spiritual Decor",
    images: [
      { id: "img1", url: "https://example.com/images/product1.jpg" },
      { id: "img2", url: "https://example.com/images/product1_alt.jpg" },
    ]
  },
  {
    id: "2",
    title: "Handcrafted Duck",
    subtitle: "Elegant decor",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712734707835-DSC00894.JPG",
    description: "A set of three elegant candle holders in different sizes.",
    collection_name: "Home Essentials",
    images: [
      { id: "img1", url: "https://example.com/images/product2.jpg" },
      { id: "img2", url: "https://example.com/images/product2_alt.jpg" },
    ]
  },
  {
    id: "3",
    title: "Marble Dust Buddha",
    subtitle: "Folk Dance And Storytelling",
    thumbnail: "/marbledust.JPG",
    description: "Rajasthani music is about using beautiful rhythm and words to lyrically describe their love for the forest, animals, water, everyday life.",
    collection_name: "Modern Decor",
    images: [
      { id: "img1", url: "https://example.com/images/product3.jpg" },
      { id: "img2", url: "https://example.com/images/product3_alt.jpg" },
    ]
  },
  {
    id: "4",
    title: "BRASS GANESHA WITH STONE WORK",
    subtitle: "Beauty Sleep",
    thumbnail: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00774.JPG",
    description: "Luxury silk pillowcase to enhance your beauty sleep.",
    collection_name: "Bedroom Essentials",
    images: [
      { id: "img1", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984889-DSC00975.JPG" },
      { id: "img2", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00773.JPG", },
      { id: "img3", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00774.JPG", },
      { id: "img4", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00504 copy.jpg", },
      { id: "img4", url: "https://dhruvcraftshouse.com/backend/uploads/1712764984890-DSC00504 copy.jpg", },

    ]
  }
];
const FeaturedProducts = () => {
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  // Define firstCollectionProducts with an explicit type
 // State to store the API response
 const [apiResponse, setApiResponse] = useState(null);

 // Fetch data from the API
 useEffect(() => {
   const fetchDashboardData = async () => {
     try {
       const response = await fetch('http://localhost:9000/store/dashboard');
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
       const data = await response.json();
       console.log('API Response:', data);
       setApiResponse(data);
     } catch (error) {
       console.error('Failed to fetch data:', error);
     }
   };

   fetchDashboardData();
 }, []); // Empty dependency array ensures this effect runs only once after the initial render

  useEffect(() => {
    // Fetch collections
    medusa.collections.list().then(({ collections }) => {
      setCollections(collections);

      // Fetch products for each collection
      const productPromises = collections.map(collection =>
        // Updated part of the useEffect where products are mapped
        medusa.products.list({ collection_id: [collection.id] }).then(response => ({
          collectionId: collection.id,
          products: response.products.map(product => {
            // Check and modify the thumbnail URL if it matches one of the specified conditions
            let thumbnail = product.thumbnail || ''; // Provide a default empty string
            const localhostBaseUrl = "http://localhost:9000/uploads/";
            const remoteBaseUrl = "http://195.35.20.220:9000/uploads/";
            const newBaseUrl = "https://dhruvcraftshouse.com/backend/uploads/";

            if (thumbnail.startsWith(localhostBaseUrl)) {
              thumbnail = thumbnail.replace(localhostBaseUrl, newBaseUrl);
            } else if (thumbnail.startsWith(remoteBaseUrl)) {
              thumbnail = thumbnail.replace(remoteBaseUrl, newBaseUrl);
            }

            // Map the product images to the Image type, ensuring that 'images' is always an array
            const images = product.images?.map(img => ({
              id: img.id,
              url: img.url.replace(localhostBaseUrl, newBaseUrl) // Update image URLs
            })) || []; // Ensure fallback to an empty array if undefined

            console.log('product at base index', product)
            // Ensure id, title, and subtitle are not undefined. Provide default values or use non-null assertion operator.
            return {
              id: product.id || 'default-id', // Consider providing a sensible default or handling the undefined case
              title: product.title || 'No title', // Default title if undefined
              subtitle: product.subtitle || 'No subtitle', // Default subtitle if undefined
              thumbnail: thumbnail, // Use the potentially modified thumbnail URL
              description: product.description || 'No description',
              collection_name: product.collection?.title || 'No collection',
              images: images, // Add the mapped images here

            }
          })
        }))
      );


      Promise.all(productPromises).then((data) => {
        // Explicitly type the accumulator as Record<string, Product[]>
        const productsByCollection = data.reduce<Record<string, Product[]>>((acc, curr) => {
          acc[curr.collectionId] = curr.products;
          return acc;
        }, {});

        setProducts(productsByCollection);
      });
    });
  }, []);

  let firstCollectionProducts: Product[] = [];
  let secondCollectionProducts: Product[] = [];



  // Update firstCollectionProducts with the actual products once they are fetched
  useEffect(() => {
    if (collections.length > 0 && Object.keys(products).length > 0) {
      firstCollectionProducts = products[collections[0].id] || [];
      //  console.log('firstCollectionProducts', firstCollectionProducts)
    }
  }, [collections, products]);

  if (collections.length > 0 && Object.keys(products).length > 0) {
    // Get the first collection's ID
    const firstCollectionId = collections[0].id;

    // Get the products for the first collection
    const allProductsOfFirstCollection = products[firstCollectionId] || [];

    // Assign only the first four products to firstCollectionProducts
    firstCollectionProducts = allProductsOfFirstCollection.slice(0, 2);

    // console.log('First Collection Products:', firstCollectionProducts);
  }

  // Update firstCollectionProducts with the actual products once they are fetched
  useEffect(() => {
    if (collections && collections.length > 0 && Object.keys(products).length > 0) {
      secondCollectionProducts = products[collections[0].id] || [];
      // console.log('secondCollectionProducts', secondCollectionProducts)
    }
  }, [collections, products]);

  if (collections && collections.length > 0 && Object.keys(products).length > 0 && collections[1]) {
    // Get the first collection's ID
    const secondCollectionId = collections[1].id;

    // Get the products for the first collection
    const allProductsOfSecondCollection = products[secondCollectionId] || [];

    // Assign only the Second four products to secondCollectionProducts
    secondCollectionProducts = allProductsOfSecondCollection.slice(0, 4);

    //  console.log('Second Collection Products:', secondCollectionProducts);
  }
  // Determine if there are products to display for the first two collections
  const hasProductsForFirstCollection = collections.length > 0 && products[collections[0]?.id]?.length > 0;
  const hasProductsForSecondCollection = collections.length > 1 && products[collections[1]?.id]?.length > 0;

  // console.log('firstCollectionProducts', firstCollectionProducts)
  // console.log('secondCollectionProducts', secondCollectionProducts)
  // console.log('hasProductsForFirstCollection', hasProductsForFirstCollection)
  // console.log('hasProductsForSecondCollection', hasProductsForSecondCollection)
  // console.log('products[collections[0].id]', products[collections[0].id])
  return (
    <div className="mt-8">
      <div>
        {/* {hasProductsForFirstCollection || hasProductsForSecondCollection && (
        <> */}
        {/* Conditionally render ProductRail for the first collection if products are available */}
        {staticProducts && (
          <>
          <FirstProductRail products={staticProducts.slice(0, 2)} />
            {/* <ProductRail products={staticProducts.slice(0, 2)} /> */}
            <SecondProductRail products={[staticProducts[2]]} />
            <ThirdProductRail products={[staticProducts[3]]} />
          </>
        )}

        {/* Conditionally render CollectionList for the second collection if products are available */}
        {staticProducts && (
          <>
            <h1 className="mt-3" style={{ textAlign: "center", fontSize: "32px", fontWeight: 600, fontFamily: "Avenir Next LT W02 Regular" }}>SCULPTURES</h1>
            <CollectionList products={collectionProducts.slice(0, 4)} />

          </>
        )}
        {/* </>
      )} */}
      </div>
    </div>
  );
};

export default FeaturedProducts
