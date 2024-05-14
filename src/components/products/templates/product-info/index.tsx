import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"
//additional imports for our customized ProductInfo template
import useProductPrice from "@/lib/hooks/use-product-price"
import {
  ProductProvider,
  useProductActions,
} from "@/lib/context/product-context"
import React, {useMemo, useState, useEffect} from "react"
import axios from 'axios';
import { useCart, useMeCustomer } from "medusa-react"
import Medusa from "@medusajs/medusa-js"
import './ProductInfoStyles.css'; // Importing the CSS file
import { useProductCategories } from "medusa-react"
import { MEDUSA_BACKEND_URL } from "@/lib/config"

//changed ProductInfoProps type with customized addition of Reviews
type ProductInfoProps = {
  product: PricedProduct;
  onReviewsClick: () => void; // Add this line
};

//following are the additional types and interfaces to facilitate ReviewsandRatings
interface CategoryDetails {
  product_category: {
    id: string;
    name: string;
    handle: string;
    parent_category?: {
      id: string;
      name: string;
      handle: string;
    };
  };
}

// Update CategoryWithProducts type to include handle
type CategoryWithProducts = {
  id: string;
  name: string;
  handle: string;
  productIds: string[];
};

// Define a type for the structure of category details including the handle
type AncestorCategory = {
  id: string;
  name: string;
  handle: string;
};

type StarRatingProps = {
  rating: number;
  onRatingChange?: (newRating: number) => void;
};

//additional component for StarRating 
const StarRating: React.FC<StarRatingProps & { onStarClick: () => void }> = ({ rating, onRatingChange, onStarClick }) => {
  const handleClick = (newRating: number) => {
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="starMain filled-starMain"
          onClick={() => { handleClick(i + 1); onStarClick(); }}
        >
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

// Initialize Medusa client
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

//changed our following ProductInfo component to include Reviews as one of the props
const ProductInfo: React.FC<ProductInfoProps> = ({ product, onReviewsClick }) => {

  //following states initialized for customized Rating functionality , comments, and buyXgetYoffer functionalities
  const [productRating, setProductRating] = useState<number>(3.5); // Initial rating
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const { customer } = useMeCustomer();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const buyGetNumber = product.buy_get_num;
  const buyGetOffer = product.buy_get_offer;

  // console.log("buyGetNumber ",buyGetNumber,"buyGetOffer",buyGetOffer )
  
  // Assuming cart is of type Cart
const { cart } = useCart();



if (cart) {
  // Check if cart exists to avoid runtime errors
  const discounts = cart.discounts;
  // console.log("discounts ",discounts)

  // Now, you can use the 'discounts' variable as needed in your code.
} else {
  // Handle the case where 'cart' is undefined, if necessary.
}

  // must be previously logged in or use api token

//folowing customized additional code for submitting comment
  const handleSubmitComment = async () => {
    if (!customer) {
      console.error("Customer data is not available");
      return;
    }
  
    // Explicitly check if product.id is defined before using it
 const productId: string = product.id!;

    // Fetching product details and setting buy-get values
//  useEffect(() => {
//   // Fetch product details and update buy-get offers
//   medusa.products.retrieve(productId)
//     .then(({ product }) => {
//      //  console.log(product.id);
//     //  console.log("product title ",product)
     
//     })
//     .catch(error => {
//       console.error("Error fetching product details: ", error);
//     });
// }, []);

    const commentData = {
      customer_id: customer.id,
      product_id: product.id,
      ratings: productRating,
      commentText: comment,
      email: customer.email
    };
  
    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/comments`, commentData);
      // console.log('Comment submission response:', response.data);
  
      // Close the comment box on successful submission
      setShowCommentBox(false);
      setComment("");
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Hide the success message after 3 seconds
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
//additional code for comment box
  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

//additional code for rating functionality
const handleRatingChange = async (newRating: number) => {
    setProductRating(newRating);
    // console.log("New Rating: ", newRating);

  };
      // Hooks and states for managing product actions
      const { updateOptions, addToCart, options, inStock, variant } =
      useProductActions()

       // Calculate price and display options for the product
  const price = useProductPrice({ id: product.id!, variantId: variant?.id })

  // Determine the displayed price
const selectedPrice = useMemo(() => {
const { variantPrice, cheapestPrice } = price

return variantPrice || cheapestPrice || null
}, [price])


// const productRating = 3.5; // This should be dynamic based on product rating

let isNewArrival = false;
    
 // Convert updated_at to a JavaScript Date object
 if (product.updated_at) {
  // Convert updated_at to a JavaScript Date object
  const updatedAt = new Date(product.updated_at);

  // Get the date 5 days ago
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // Check if the product was updated within the last 5 days
   isNewArrival = updatedAt >= fiveDaysAgo;
 }

 
 const productId = product.id;
 // console.log('productId', productId)

 // const [category, setCategory] = useState(null);

 //following is functionality to display category path which is an additional code for customization
 const [matchingCategoryId, setMatchingCategoryId] = useState<string | null>(null);

 
 const { product_categories } = useProductCategories()
 const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);

 useEffect(() => {
   const fetchProductsForCategories = async () => {
     if (product_categories) {
       const categoriesData = await Promise.all(
         product_categories.map(async (category) => {
           try {
             const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products?category_id[]=${category.id}`);
             const productIds = response.data.products.map((product : PricedProduct) => product.id);
             return {
               id: category.id,
               name: category.name,
               productIds: productIds,
             };
           } catch (error) {
             console.error('Error fetching products for category:', error);
             return null;
           }
         })
       );
       // Filter out null values and use TypeScript's type assertion
       setCategoriesWithProducts(categoriesData.filter((category): category is CategoryWithProducts => category !== null));
     }
   };
 
   fetchProductsForCategories();
 }, [product_categories]);
 

 useEffect(() => {
   if (productId) {
     const matchingCategory = categoriesWithProducts.find(category => 
       category.productIds.includes(productId)
     );
 
     if (matchingCategory) {
       setMatchingCategoryId(matchingCategory.id);
     } else {
       setMatchingCategoryId(null);
     }
   }
 }, [categoriesWithProducts, productId]);

 
 const [ancestorCategories, setAncestorCategories] = useState<string[]>([]);
 const [fullAncestorCategories, setFullAncestorCategories] = useState<AncestorCategory[]>([]);

// Function to recursively fetch ancestor categories including their handles
const fetchAncestorCategories = async (
 categoryId: string,
 accumulatedCategories: AncestorCategory[] = []
): Promise<AncestorCategory[]> => {
 try {
   const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${categoryId}`);
   const categoryData = response.data.product_category;

   const currentCategory: AncestorCategory = {
     id: categoryData.id,
     name: categoryData.name,
     handle: categoryData.handle,
   };

   accumulatedCategories.unshift(currentCategory); // Add current category at the beginning of the array

   // If there's a parent category, fetch its ancestors recursively
   if (categoryData.parent_category) {
     return fetchAncestorCategories(categoryData.parent_category.id, accumulatedCategories);
   }

   return accumulatedCategories;
 } catch (error) {
   console.error('Error fetching ancestor categories:', error);
   return accumulatedCategories; // Return what we have so far in case of an error
 }
};

const capitalizeWords = (str: string): string => {
 return str.split('').map((char, index, arr) => {
   // Capitalize if it's the first character, or the previous character is non-alphabetic
   if (index === 0 || !arr[index - 1].match(/[a-zA-Z]/)) {
     return char.toUpperCase();
   }
   return char.toLowerCase();
 }).join('');
};


// Function to remove old ancestor category name from category names
const removeOldAncestorName = (
 categories: AncestorCategory[], 
 oldAncestorName: string
): AncestorCategory[] => {
 return categories.map((category, index) => {
   if (index === 0) { // Skip the first category
     return category;
   }

   return {
     ...category,
     name: category.name.replace(new RegExp(`\\b${oldAncestorName}\\b`, 'gi'), '').trim()
   };
 });
};



useEffect(() => {
 if (matchingCategoryId) {
   fetchAncestorCategories(matchingCategoryId).then(ancestors => {
     if (ancestors.length > 0) {
       const oldAncestorName = ancestors[0].name;
       const updatedAncestors = removeOldAncestorName(ancestors, oldAncestorName);
       setFullAncestorCategories(updatedAncestors);
     }
   });
 }
}, [matchingCategoryId]);

// Find the most recent (last) category in fullAncestorCategories
const recentCategory = fullAncestorCategories[fullAncestorCategories.length - 1]?.name || '';

const maxCategoryNameLength = 41;

const calculateTotalCategoryNameLength = (categories: AncestorCategory[]) => {
  return categories.reduce((totalLength, category) => {
    return totalLength + category.name.length + (category.name === '' ? 0 : 2); // 2 for '/' and space
  }, 0);
};

//changed the return display according to include our StarRating component, categories path, comments sections
return (
  <div id="product-info">
    <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
      {/* {product.collection && (
        <Link
          href={`/collections/${product.collection.handle}`}
          className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          {product.collection.title}
        </Link>
      )} */}

{fullAncestorCategories.length > 0 && (
<div className="ancestor-categories">
  {fullAncestorCategories.map((category, index) => {
    const totalLength = calculateTotalCategoryNameLength(fullAncestorCategories.slice(0, index + 1));
    if (index > 0 && totalLength > maxCategoryNameLength) {
      return null; // Skip child categories if total length exceeds the limit
    }
    return (
      <React.Fragment key={category.id}>
        {index > 0 && " / "}
        <Link href={`/${category.handle}`} className="text-medium text-ui-fg-subtle">
          <span className={index === fullAncestorCategories.length - 1 ? "bold-text" : ""} style={{ fontSize: "15px" }}>
            {capitalizeWords(category.name)}
          </span>
        </Link>
      </React.Fragment>
    );
  })}
</div>
)}


{isNewArrival && <span className="text-medium text-ui-fg-muted -mt-2" style={{color:"#000", fontSize:"16px", marginBottom:"0px"}}>New Arrival</span>}

      <Heading level="h2" className=" leading-10 text-ui-fg-base" style={{fontWeight:500, color: "#212529", fontSize:"23.9px", lineHeight:"1.2em"}}>
        {product.title}
      </Heading>
      <div className="flex items-center -mt-2">
     
      <StarRating rating={productRating}  onStarClick={onReviewsClick} />
    <p  onClick={onReviewsClick} className="ml-4" style={{fontWeight: 500, color:"#000", textDecoration:"underline", cursor:"pointer"}}>
      Reviews
    </p>
    </div>
    
     {/* Display the recent category in bold text */}
     {/* {recentCategory && (
      <p style={{background:"transparent"}}>
<span style={{ 
  display: "inline-block",
  background: "black",
  color: "white",
  padding: "1% 3%", // This adds padding on the sides of the text.
  fontSize: "15px", // Adjust the font size as needed.
  lineHeight: "24px", // Adjust the line height to control the height of the black background.
  textAlign: "center",
  fontWeight: "bold", // This makes the text bold.
  marginTop: "10px",
}}>
  {recentCategory}
</span>
</p>
)} */}



    {showCommentBox && (
      <div className="comment-box-container">
        <textarea
          className="comment-box"
          rows={4}
          placeholder="Enter your comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button className="submit-comment-button" onClick={handleSubmitComment}>
          <span className="paper-plane-icon"></span>
        </button>
      </div>
    )}
     {showSuccessMessage && (
      <div className="success-message">
        Comment posted successfully
      </div>
    )}

      {/* <Text> */}
     
      {/* </Text> */}

      {/* <Text> */}
   
      {/* </Text> */}

      

      {/* <Text className="text-medium text-ui-fg-subtle">
        {product.description}
      </Text> */}
    </div>
    <style>
      {`
      .bold-text {
        font-weight: 500;
      }
      `}
    </style>
   
  </div>
)
}

export default ProductInfo
