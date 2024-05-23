// Import necessary hooks, components, and libraries
import {
  ProductProvider,
  useProductActions,
} from "@/lib/context/product-context"
import useProductPrice from "@/lib/hooks/use-product-price"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import Divider from "@/components/common/components/divider"
import OptionSelect from "@/components/products/components/option-select"
import clsx from "clsx"
//additional imports to include addToWishlist feature, discount display feature and product category feature
import React, { useMemo, useState, useEffect } from "react"
import Wishlist from "../../../common/icons/wishlist";
// import { getIdWishList } from './getIdWishlist'
import { getWishListItem } from './getWishListItem'
import { postToWishlist } from './postToWishlist'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/navigation"
import SignInPrompt from "../sign-in-prompt"
import { getWishList } from "./getWishlist"
import { useCart, useMeCustomer } from "medusa-react"
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context"
import { useStore } from "@/lib/context/store-context"
import Medusa from "@medusajs/medusa-js"
// import { Container } from "react-bootstrap";
// import ReactDOM from "react-dom";
// import Link from "next/link";
import { useProductCategories } from "medusa-react"
import axios from 'axios'
import { getDiscountList } from "./productDiscount"
import { MEDUSA_BACKEND_URL } from "@/lib/config"


 // Define types for props
 type ProductActionsProps = {
  product: PricedProduct
}


//additional creation of types to include wishlist and category display
type WishlistProps = {
  fill: string;
  // Remove the props prop
 }

 // Define interface for Wishlist items
interface FavoriteItem {
  id: string;
  customer_id: string;
  variant_id: string;
  email: string;
  created_at: string;
  // Include other properties as needed
}

 type WishlistItem = {
  // Type definition for items in the wishlist
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
};

type ListItem = {
  id: string | undefined
  variant_id: string | undefined
  size: string | undefined
  title: string | undefined
  thumbnail: string | null | undefined
  handle: string | null | undefined
}

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

interface Discount {
  value: number;
  type: string;
  code: string;
}

// Assuming `discounts` should be an array of `Discount` objects
type DiscountsArray = Discount[];

function generateId() {
  const timestamp = new Date().getTime(); // Current time in milliseconds
  const randomNum = Math.floor(Math.random() * 1000); // Random number for extra uniqueness
  return `${timestamp}-${randomNum}`;
}
// Initialize Medusa client
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Inner component that handles product actions
const ProductActionsInner: React.FC<ProductActionsProps> = ({ product }) => {

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

  //additional code to include addTowishlist feature, discount of product display
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const { customerId, setCustomerId,totalItems,setTotalItems} = useWishlistDropdownContext();

  const { customer } = useMeCustomer();

  const { deleteItem } = useStore();

  // const customerId = Cookies.get('customer_id');
  // const customerEmail = Cookies.get('customer_email');

    // Session storage used for retrieving customer details

  

  const variantId = variant?.id;
  const inWishlist = getWishListItem(customerId, variantId);
  // State variables for buy-get details
  const [buyGetNumber, setBuyGetNumber] = useState<number | null>(null);
  const [buyGetOffer, setBuyGetOffer] = useState<number | null>(null);
  const [salesQuantity, setSalesQuantity] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);


  // console.log("product id ",product.id);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { listItems, setListItems } = useWishlistDropdownContext();

// Explicitly check if product.id is defined before using it
const productId: string = product.id!;

//  console.log('productId medusa', productId)
medusa.products.retrieve(productId)
.then(({ product }) => {
// console.log("product medusa",product);
// console.log('product.variants', product.variants)
// console.log('options medusa', product.options)
})
.catch(error => {
console.error("Error fetching product details: ", error);
});
// console.log('product maIN', product)
// console.log('first', options)
// console.log('variant', variant)

// Fetching product details and setting buy-get values
//following set of additional code is used to set buyXgetY offer discount
useEffect(() => {
 // Fetch product details and update buy-get offers
 medusa.products.retrieve(productId)
   .then(({ product }) => {
    //  console.log(product.id);
    console.log("product test ",product)
    console.log("buy get number ",product?.buy_get_num)
    console.log("buy get offer ",product?.buy_get_offer)

     setBuyGetNumber(product?.buy_get_num || null);
     setBuyGetOffer(product?.buy_get_offer || null);
     setSalesQuantity(product?.sales_quantity || null);
     console.log('product discount', product.discountCode)
     setDiscountCode(product.discountCode || null);
   })
   .catch(error => {
     console.error("Error fetching product details: ", error);
   });
}, []);
 
//following are the additional code to include addToWishlist feature and wishlist existence
  // Check wishlist status
  const checkWishlist = async () => {
    const inWishlist = await getWishListItem(customer?.id, variant?.id);
          // console.log("in wishlist ",inWishlist)

    setIsInWishlist(inWishlist || false);
   };

   if(customer?.id && variant?.id)
   {
    checkWishlist();

   }

   const getListItem = async (item: FavoriteItem): Promise<ListItem> => {
    const response = await medusa.products.variants.retrieve(item.variant_id);
    const variant = response.variant;

    return {
      id: item.id, // Generates a unique ID
      variant_id: variant.id,
      size: variant.title,
      title: variant.product?.title,
      thumbnail: variant.product?.thumbnail,
      handle: variant.product?.handle
    };
  };

  const handleAddToWishlist = async () => {

    console.log("clicked handle Add to wishlist");
    if(!customer?.id) {
      setShowSignInPrompt(true);
      return;
    }

    postToWishlist(customer?.id, customer?.email, variant?.id)
    const response= await getWishList(customer?.id);
    setIsInWishlist(!isInWishlist);
    setMessage(isInWishlist ? 'Remove from wishlist' : 'Add to wishlist');
    // console.log("getWishlist at post ",response)
    setTotalItems(response.wishlist.length)

    if (response.wishlist && Array.isArray(response.wishlist)) {
      const wishlistPromises = response.wishlist.map(getListItem);
      const wishlistItems = await Promise.all(wishlistPromises);
      setListItems(wishlistItems);

      // console.log("listItems product ",listItems)
    }
  }

   // Async function to handle fetching wishlist data
   const handleData = async () => {
    try {
      const response = await getWishList(customer?.id);
      // Make sure to return an object with a wishlist property
      return response || { wishlist: [] }; // Fallback if response is falsy
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return { wishlist: [] }; // Fallback in case of error
    }
  };
  
     // useEffect hook to fetch wishlist data and update state
useEffect(() => {
  let isCancelled = false;

  const fetchWishlist = async () => {
    const data = await handleData();
    if (data?.wishlist && Array.isArray(data.wishlist)) {
      data.wishlist.forEach((item: FavoriteItem) => {
        medusa.products.variants.retrieve(item.variant_id)
          .then(({ variant }) => {
            // Check if the operation was cancelled while awaiting response
            if (isCancelled) return;
  
            // Functional update to add the new item or keep the old ones
            setWishlistItems((prevItems) => {
              const itemExists = prevItems.some((prevItem) => prevItem.id === item.id);
              if (itemExists) {
                // If the item already exists, return the current state
                return prevItems;
              } else {
                // Add the new item to the state
                return [
                  ...prevItems,
                  {
                    id: item.id,
                    variant_id: variant.id,
                    size: variant.title,
                    title: variant.product?.title,
                    thumbnail: variant.product?.thumbnail,
                    handle: variant.product?.handle,
                  },
                ];
              }
            });
          })
          .catch((error) => console.error("Error fetching variant details:", error));
      });
    } else {
      // Handle the case where the wishlist data is not in the expected format
      console.log("Wishlist data is not in expected format:", data);
    }
  };
  

  fetchWishlist();

  return () => {
    isCancelled = true;
  };
}, [customer?.id]); // Make sure the dependencies are correct

//following are the additonal code to include feature of message based on quantity of the stock of the product
const [quantity, setQuantity] = useState<number | undefined>(undefined);


medusa.products.variants.list()
.then(({ variants }) => {
// console.log("variants ",variants);

// Find the variant with the matching product_id
const variant = variants.find(variant => variant.product_id === product.id);
if (variant) {
// console.log("title",product.title,"inventory quantity ", variant.inventory_quantity);
setQuantity(variant.inventory_quantity);
}
})

//follwoing are additional code to customize feature of disabling add to cart button if product kis in already in wishlist
const { cart } = useCart();
// console.log("cart at product ",cart)

const isInCart = (cart?.items.some(item => item.variant_id === variant?.id)) ?? false;
// Define a CSS class for the mustard yellow button
const mustardYellowButtonStyle = "bg-mustard-yellow text-white";

const deleteCartItem = (variantId: any) => {
console.log("delete item ", variant?.id);

// Find the item in the cart that matches the variantId
const itemToDelete = cart?.items.find(item => item.variant_id === variant?.id);

if (itemToDelete) {
  console.log("Item to delete: ", itemToDelete.id);
  deleteItem(itemToDelete.id)
  // Here you can call your function to delete the item from the cart
} else {
  console.log("Item not found in the cart");
}
};

//  console.log("product actions ",product)

const inventory_quantity = variant?.inventory_quantity;

//  // must be previously logged in or use api token

console.log("variant ",variant)
// console.log("variant options ",variant?.options)
// console.log('product.options', product.options)

// Map variant options to product options
const variantOptionValues = variant?.options.map(variantOption => {
// Use optional chaining and provide a fallback empty array
const productOption = product.options?.find(option => option.id === variantOption.option_id);
if (!productOption) {
  // Handle the case where productOption is not found
  return null;
}
return {
  ...productOption,
  selectedValue: variantOption.value,
};
}).filter(option => option !== null); // Filter out null values

// console.log('variants', product.variants)

//following are the additional code to show categories path
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

//folowing are the additional code to display list of specific discount of that product
 // State variable to store discounts
 const [discounts, setDiscounts] = useState<DiscountsArray>([]);

 // Function to fetch and set the discounts array
 const fetchDiscounts = async () => {
   try {
     const discountsResponse = await getDiscountList(productId); // Call your getDiscountList function here
     console.log('discounts at store', discountsResponse);

     // Set the discounts state with the received data
     setDiscounts(discountsResponse);
   } catch (error) {
     console.error("Error fetching discounts: ", error);
   }
 };

 // Call the fetchDiscounts function when the component mounts
 useEffect(() => {
   fetchDiscounts();
 }, []);

 // Render discounts if they exist
 const renderDiscounts = () => {
  // First, ensure the array is defined and has at least one element
  if (!discounts || discounts.length === 0) {
    return null;  // Return null or an alternative component to indicate no discounts are available
  }

  const firstDiscount = discounts[0];  // Safely get the first element

  // Additional safety check just in case the first element is somehow undefined or null
  if (!firstDiscount) {
    return null;
  }

  return (
    <div>
      <p style={{fontSize: "14px", color: "#D7373D"}}>
        Extra {firstDiscount.value}{firstDiscount.type} off with code: {firstDiscount.code}
      </p>
    </div>
  );
};


  // return (
  //   <div className="flex flex-col gap-y-2">
  //     <div>
  //       {product.variants.length > 1 && (
  //         <div className="flex flex-col gap-y-4">
  //           {(product.options || []).map((option) => {
  //             return (
  //               <div key={option.id}>
  //                 <OptionSelect
  //                   option={option}
  //                   current={options[option.id]}
  //                   updateOption={updateOptions}
  //                   title={option.title}
  //                 />
  //               </div>
  //             )
  //           })}
  //           <Divider />
  //         </div>
  //       )}
  //     </div>

  //     {selectedPrice ? (
  //       <div className="flex flex-col text-ui-fg-base">
  //         <span
  //           className={clsx("text-xl-semi", {
  //             "text-ui-fg-interactive": selectedPrice.price_type === "sale",
  //           })}
  //         >
  //           {selectedPrice.calculated_price}
  //         </span>
  //         {selectedPrice.price_type === "sale" && (
  //           <>
  //             <p>
  //               <span className="text-ui-fg-subtle">Original: </span>
  //               <span className="line-through">
  //                 {selectedPrice.original_price}
  //               </span>
  //             </p>
  //             <span className="text-ui-fg-interactive">
  //               -{selectedPrice.percentage_diff}%
  //             </span>
  //           </>
  //         )}
  //       </div>
  //     ) : (
  //       <div></div>
  //     )}

  //     <Button
  //       onClick={addToCart}
  //       disabled={!inStock || !variant}
  //       variant="primary"
  //       className="w-full h-10"
  //     >
  //       {!inStock
  //         ? "Out of stock"
  //         : !variant
  //         ? "Select variant"
  //         : "Add to cart"}
  //     </Button>
  //   </div>
  // )

  // console.log('buyGetNumber', buyGetNumber)
  // console.log('buyGetOffer', buyGetOffer)
  // console.log('discountCode', discountCode)

console.log('product.is_giftcard', product.is_giftcard)
  // Render the component with product options and actions
  return (
    <div className="flex flex-col gap-y-2">
         {showSignInPrompt && <SignInPrompt />}
         
         {renderDiscounts()} {/* Render discounts if they exist */}

                {salesQuantity && salesQuantity > 5 &&(
      <p className="mt-1" style={{color:"red", fontSize:"14px", fontWeight: 600}}>BESTSELLER</p>
      )}
         <div className="mb-1" >
         {selectedPrice ? (
        <div className="flex flex-col text-ui-fg-base" >
          
          {selectedPrice.price_type !== "sale" && (
            <p>
          <span
            // className={clsx("text-xl-semi", {
            //   "text-black": selectedPrice.price_type === "sale",
            // })}
            className="text-xl-semi text-black"
            // style={{fontSize:"18px", color:"black"}}
          >
            {selectedPrice.calculated_price}
          </span>
            <span className="pt-1 pl-2" style={{fontWeight: 400, color: "#666666", fontSize:"14px"}}>Price excl. VAT
            </span>
            </p>
          )}
          
          {selectedPrice.price_type === "sale"? (
            <>
              <p>
                {/* <span className="text-ui-fg-subtle">Original: </span> */}
                <span className="line-through text-black pl-1" style={{fontSize:"18px", color:"", fontWeight: 500}}>
                  {selectedPrice.original_price}
                </span>
                <span
            className={clsx("text-xl-semi", {
              "text-red pl-1": selectedPrice.price_type === "sale",
            })}
            style={{fontSize:"20px"}}
          >
            {selectedPrice.calculated_price}
          </span>
          <span className="pt-1 pl-2" style={{fontWeight: 400, color: "#666666", fontSize:"14px"}}>Price excl. VAT
              </span>
              </p>
              <p style={{background:"transparent"}}>
  <span style={{ 
    display: "inline-block",
    background: "black",
    color: "white",
    padding: "1% 3%", // This adds padding on the sides of the text.
    fontSize: "15px", // Adjust the font size as needed.
    lineHeight: "24px", // Adjust the line height to control the height of the black background.
    textAlign: "center",
    fontWeight: 500, // This makes the text bold.
    marginTop: "10px",
  }}>
       SALE -{selectedPrice.percentage_diff}%
  </span>
  {recentCategory && (
  <span style={{ 
    display: "inline-block",
    marginLeft:"6%",
    background: "black",
    color: "white",
    padding: "1% 3%", // This adds padding on the sides of the text.
    fontSize: "14px", // Adjust the font size as needed.
    lineHeight: "24px", // Adjust the line height to control the height of the black background.
    textAlign: "center",
    fontWeight: 700, // This makes the text bold.
    marginTop: "10px",
  }}>
    {recentCategory}
  </span>
)}
  </p>
  
            </>
          ):(
            <>
             <p style={{background:"transparent"}}>
  {recentCategory && (
  <span style={{ 
    display: "inline-block",
    background: "black",
    color: "white",
    padding: "1% 3%", // This adds padding on the sides of the text.
    fontSize: "15px", // Adjust the font size as needed.
    lineHeight: "24px", // Adjust the line height to control the height of the black background.
    textAlign: "center",
    fontWeight: 700, // This makes the text bold.
    marginTop: "10px",
  }}>
    {recentCategory}
  </span>
)}
  </p>
  
            </>
          )}
        </div>
      ) : (
        <div></div>
      )}
      </div>
      {buyGetNumber && buyGetOffer && (
  <div>
    <p style={{color:"green", letterSpacing:"-0.05em"}}>
      Buy {buyGetNumber} Get {buyGetOffer} % Offer
      {discountCode ? ` using code ${discountCode}` : ''}
    </p>
  </div>
)}

      
  {/* {product.options && product.options.length > 0 ? (
    <div className="flex flex-col gap-y-4">
      {product.options.map((option) => (
        <div key={option.id}>
          <OptionSelect
            product={product}
            option={option}
            current={options[option.id]}
            updateOption={updateOptions}
            title={option.title}
            variant={variant}
            inventory_quantity={inventory_quantity}
          />
        </div>
      ))}
      <Divider />
    </div>
  ) : variantOptionValues && variantOptionValues.length > 0 ? (
    <div className="flex flex-col gap-y-4">
      {variantOptionValues.map((option) => (
        option && ( // Type guard to check if option is not null
          <OptionSelect
            key={option.id}
            product={product}
            option={option}
            current={options[option.id]}
            updateOption={updateOptions}
            title={option.title}
            variant={variant}
            inventory_quantity={inventory_quantity}
          />
        )
      ))}
      <Divider />
    </div>
  ) : null} */}


<div>
        {product.variants.length > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={updateOptions}
                    title={option.title}
                  />
                </div>
              )
            })}
            <Divider />
          </div>
        )}
      </div>
      {/* <Link href="#" className="mt-2" style={{fontWeight: 500, fontSize: "14px", textDecoration:"underline"}} onClick={handleOpenSizeGuideModal}>Size Guide</Link> */}

      {/*<SizeGuideModal isOpen={isSizeGuideModalOpen} onClose={handleCloseSizeGuideModal} /> /*}
     
      {/* {variant && inventory_quantity !== undefined ? (
  inventory_quantity < 8 ? (
    <p className="flex items-center gap-x-2" style={{ color: "red", fontSize: "13.5px" }}>
      Only {inventory_quantity} left in Stock
    </p>
  ) : (
    <p className="flex items-center gap-x-2" style={{ color: "#696969", fontSize: "13.5px" }}>
      In Stock
    </p>
  )
) : null} */}

<Button
  onClick={() => {
    if (isInCart) {
      deleteCartItem(variant?.id)
    } else {
      addToCart()
    }
  }}
  disabled={!product.is_giftcard && (!inStock || !variant || isInWishlist)}
  variant="primary"
  className={clsx(
    "w-full h-10",
    {
      "mustard-yellow": isInCart,
      "other-color": !isInCart,
    }
  )}
  title={isInCart ? "Click to delete item from cart" : ""}
  style={{ borderRadius: "0px", fontSize: "16px", textTransform: "uppercase" }}
>
  {!product.is_giftcard && !inStock
    ? "Out of stock"
    : !variant
      ? "Select variant"
      : isInCart
        ? "Already in cart"
        : "Add to cart"}
</Button>



      <Button
        onClick={handleAddToWishlist}
        disabled={!inStock || !variant}
        variant="secondary"
        className="w-full h-10"
        style={{borderRadius:"0px", fontSize:"16px", textTransform:"uppercase", background:"#F6F6F6"}}

        >
        {!inStock
          ? "Out of stock"
          : !variant
          ? "Select variant"
          : <>
            {isInWishlist ? (
                <>
                <Wishlist fill="red" />  Remove from Wishlist
                </>
                ) : (
                <>
                  <Wishlist fill=""/> Add to Wishlist
                </>
                )}
            </>
        }
        </Button>
        <style>{`
        .mustard-yellow{
          background-color: #FF9800;
        }
        .text-red{
          color: RGB(181, 31, 41);
        }
      
        `}</style>

    </div>
  )
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => (
  <ProductProvider product={product}>
    <ProductActionsInner product={product} />
  </ProductProvider>
)

export default ProductActions
