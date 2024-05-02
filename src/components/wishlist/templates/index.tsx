"use client"

// Import necessary hooks, /libraries, and components
import { useState, useEffect } from "react"
import Medusa from "@medusajs/medusa-js";
import { getWishList } from "./getWishlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
import { deleteWishlist } from './deleteWishlist'
import Link from "next/link"
import SignInPrompt from "../components/sign-in-prompt"
import EmptyCartMessage from "../components/empty-cart-message"
import Trash from "@/components/common/icons/trash"
import {
  ProductProvider,
  useProductActions,
} from "@/lib/context/product-context"
import { useCart, useMeCustomer, } from "medusa-react"
import { useCreateLineItem } from "medusa-react"
import Modal from 'react-modal';
import Button from "@/components/common/components/button";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context"
import { getDiscountList } from "./productDiscount"
import './Wishlist.css';
import { MEDUSA_BACKEND_URL } from "@/lib/config";
import LoadingSpinner from "@/components/loader"
import { usePathname } from "next/navigation"

// Defining types for wishlist items and favorite items
interface FavoriteItem {
  id: string;
  customer_id: string;
  variant_id: string;
  email: string;
  created_at: string;
  // include other properties as needed
}

type WishlistItem = {
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
  // product_id: string | undefined; // Add product_id attribute
};

// Initializing the Medusa client
const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});



// Component to render the Wishlist
const WishlistTemplate = () => {

  const { customerId, setCustomerId, totalItems, setTotalItems } = useWishlistDropdownContext();

  const { customer } = useMeCustomer();

  const route = usePathname()
  console.log('route summary', route)

  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  // Initialize clickedPath with the current pathname when the component mounts
  useEffect(() => {
    setClickedPath(route);
  }, [route]);

  useEffect(() => {
    // Determine if navigation is occurring
    setIsNavigating(route !== clickedPath);
  }, [route, clickedPath]);

  // Function to handle link clicks
  const handleLinkClick = (targetPath: string) => {
    // Check if the target path is the same as the current route
    if (targetPath === route) {
      console.log("Already on the same page:", targetPath);
      // Do not proceed with navigation
      return;
    }

    console.log("Link clicked with path:", targetPath);
    setClickedPath(targetPath); // Update clickedPath to the target path
    setIsNavigating(true); // Assume navigation is starting
  };

  // console.log("customer wish",customer)
  // Component for the confirmation dialog when deleting an item
  const ConfirmationDialog = ({ itemId, onConfirm, onCancel }: { itemId: any; onConfirm: any; onCancel: any; }): React.ReactElement | null => {
    if (!itemId) {
      return null;
    }

    return (
      <Modal
        isOpen={!!itemId}
        contentLabel="Confirmation Dialog"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            padding: "5%",
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          }
        }}
      >
        <p>Are you sure you want to delete this item from your wishlist?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', paddingTop: "5%" }}>
          <Button style={{ marginRight: "20px" }} onClick={() => onConfirm(itemId)}>DELETE</Button>
          <Button style={{ marginLeft: "20px" }} variant="secondary" onClick={onCancel}>CANCEL</Button>
        </div>
      </Modal>
    );
  };


  // Using Medusa's cart hooks
  const { cart, createCart } = useCart();
  const cartId = cart?.id || '';
  const createLineItem = useCreateLineItem(cartId);

  // Fetching wishlist data
  const handleData = async () => {
    const dataCreated = await getWishList(customer?.id)
    // console.log("data at wishlist ",dataCreated)
    return dataCreated;
  }
  // State variables for wishlist management
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [slicedWishlistItems, setSlicedWishlistItems] = useState<WishlistItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { listItems, setListItems } = useWishlistDropdownContext();


  // Inside WishlistTemplate component
  useEffect(() => {
    if (!customer) {
      // console.log('No customer data, redirecting to login');
      // window.location.href = '/account/login'; // Redirect to login page
    } else {
      medusa.auth.getSession()
        .then(({ customer }) => {
          // console.log("Customer is authenticated", customer);
          // Proceed with your logic here
        })
        .catch(error => {
          console.error("Error during session retrieval: ", error);
        });
    }
  }, [customer]);

  // useEffect hook to fetch wishlist data and update state
  useEffect(() => {
    let isCancelled = false;

    const fetchWishlist = async () => {
      const data = await handleData();
      if (data.wishlist && Array.isArray(data.wishlist)) {
        data.wishlist.forEach((item: FavoriteItem) => {
          medusa.products.variants.retrieve(item.variant_id)
            .then(({ variant }) => {
              if (isCancelled) return;
              // Use a functional update to ensure the latest state is used
              setWishlistItems(prevItems => {
                // Check if item already exists to prevent duplicates
                const itemExists = prevItems.some(prevItem => prevItem.id === item.id);
                return itemExists ? prevItems : [...prevItems, {
                  id: item.id,
                  size: variant.title,
                  variant_id: variant.id,
                  title: variant.product?.title,
                  thumbnail: variant.product?.thumbnail,
                  handle: variant.product?.handle
                }];
              });
              // setWishitems(wishlistItems)
            })
        });
      }
    };

    fetchWishlist();

    return () => {
      isCancelled = true;
    };
  }, [customer?.id]); // Make sure the dependencies are correct



  // Function to handle adding an item to the cart  
  const addToCart = (variantId: any, quantity: number, id: any) => {
    // Confirmation dialog setup
    confirmAlert({
      title: 'Do you want to add this to your cart',
      buttons: [
        {
          label: 'Add to Cart',
          onClick: () => {
            createLineItem.mutate({
              variant_id: variantId,
              quantity,
            });
            // navigate to /cart page
            deleteWishlist(id);
            // Get the current value of totalWishlistItems from the cookie
            // Get the current value of totalWishlistItems from the cookie
            const currentTotalItems = totalItems;
            setTotalItems(currentTotalItems - 1);
            setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
            // setWishitems(prevItems => prevItems.filter(item => item.id !== id));
            setListItems(prevItems => prevItems.filter(item => item.id !== id));

            // console.log("listItems at delete ",listItems)
            window.location.href = '/cart';
            handleLinkClick('/cart')
          },
          style: { marginRight: '20px' } // Add this line
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };


  // Function to set an item for deletion
  const deleteItem = (id: any) => {
    // console.log("Deleting item with ID:", id);
    setItemToDelete(id);
  };


  // console.log('listItems', listItems)
  // console.log('wishlistItems', wishlistItems)

  // State variable to store discounts
  const [discounts, setDiscounts] = useState<any[] | null>(null);

  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = [];
      for (const item of listItems) {
        console.log('item wishlist variant', item.variant_id);
        let productId;
        if (item.variant_id) {
          // Wait for the variant retrieval to complete
          const variantResponse = await medusa.products.variants.retrieve(item.variant_id);
          productId = variantResponse.variant.product_id;
        }

        // Ensure productId is defined before calling getDiscountList
        if (productId) {
          const discountsResponse = await getDiscountList(productId);
          // Add the discounts to the array
          fetchedDiscounts.push({
            ...discountsResponse,
            title: item.title, // Add item title here
            product_id: productId, // Add product_id here
          });
        }
      }
      console.log('discountResponse', fetchedDiscounts)
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      console.error("Error fetching discounts: ", error);
      setDiscounts([]); // Set an empty array in case of an error
    }
  };


  // Call the fetchDiscounts function when the component mounts or when wishlistItems change
  useEffect(() => {
    if (listItems.length > 0) {
      fetchDiscounts();
    }
  }, [listItems]);

  const transformThumbnailUrl = (url: string | null): string => {
    if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
    return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
  };  
  // console.log('discounts', discounts)
  // Render function  
  return (
    <div style={{ background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* <div className="border-b border-gray-200 pb-7 pt-7 flex items-center" style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
       
        <h1 className="text-xl-semi">Wishlist</h1>
      </div> */}

      {isNavigating && <LoadingSpinner />}


      {/* Wishlist page layout and logic */}

      {/* Conditional rendering based on wishlist items */}
      {listItems.length > 0 ? (
        <div style={{ background: "white", width: "90%", padding: "", marginTop: "6%", marginBottom: "10%" }}>
          <div className="flex flex-col bg-white p-6 gap-y-6" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!customer?.id && <SignInPrompt />}
          </div>
          <div className=" pb-7 pt-7 flex items-center" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "90%" }}>

              <h1 className="text-xl-semi" style={{ textAlign: "left", fontSize: "29px" }}>
                {customer?.first_name}&apos;s Wishlist
              </h1>

            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <hr style={{ width: "90%" }} />
          </div>
          {/* <ItemsTemplate items={wishlistItems} /> */}

          <div style={{ marginTop: "3%", display: "flex", alignItems: "center", justifyContent: "center", background: "", }}>
            {/* Display Discounts if they exist */}
            {
              discounts && discounts.length > 0 && discounts.some(discount => discount.code || discount.value) && (
                <div style={{ border: "1px solid black", padding: "1%" }}>
                  {discounts
                    .filter((discount, index, self) =>
                      index === self.findIndex(t => t.product_id === discount.product_id) // Exclude duplicates based on product_id
                    )
                    .filter(discount => discount != null) // Filter out null or undefined elements
                    .map((discount, index) => (
                      <div key={index}>
                        {discount.code && discount.value && discount.type && (
                          <p style={{ fontSize: "15px", color: "black" }}>
                            USE CODE <span style={{ fontWeight: 600 }}>{discount.code}</span> for Extra <span style={{ fontWeight: 600 }}>{discount.value}{discount.type}</span> off for <span style={{ fontWeight: 600 }}>{discount.title}</span>
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )
            }

          </div>
          <div style={{ marginTop: "3%", display: "flex", alignItems: "center", justifyContent: "center", background: "" }}>
            <div style={{ width: "90%", paddingBottom: "10%" }}>
              {itemToDelete !== null && (
                <ConfirmationDialog
                  itemId={itemToDelete}
                  onConfirm={(id: any) => {
                    deleteWishlist(id);
                    // Get the current value of totalWishlistItems from the cookie
                    // Get the current value of totalWishlistItems from the cookie
                    const currentTotalItems = totalItems;
                    setTotalItems(currentTotalItems - 1);
                    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
                    // setWishitems(prevItems => prevItems.filter(item => item.id !== id));
                    setListItems(prevItems => prevItems.filter(item => item.id !== id));

                    // console.log("listItems at delete ",listItems)
                    setItemToDelete(null);
                  }}
                  onCancel={() => setItemToDelete(null)}
                />
              )}

              <table style={{ background: "", width: "90%", paddingBottom: "10%" }}>
                <thead>
                  <tr>
                    {/* <th>Title</th> */}
                    {/* <th>Thumbnail</th>
                  <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {listItems.map((item, index) => (
                    <tr key={index} style={{ marginTop: "10%", paddingTop: "10%", paddingBottom: "10%" }}>
                      <Link href={`/products/${item.handle}`}>
                        <td style={{ paddingTop: "3%", paddingBottom: "3%" }}>
                          <img src={transformThumbnailUrl(item.thumbnail || "")} alt={item.title} />
                        </td>
                      </Link>
                      <td style={{ paddingLeft: "4%", background: "", width: "60%", verticalAlign: "middle", }}>
                        <Link href={`/products/${item.handle}`}>

                          <p style={{ color: "#374151", fontSize: "18px", marginBottom: "10px", fontWeight: 500 }}>{item.title}</p>
                          <p style={{ color: "#374151", fontSize: "15px", marginBottom: "10px" }}>
                            {item.size?.split('#')[0]} {item.size?.split('#')[1] ? `/ ${item.size?.split('/')[1]}` : ''}
                          </p>

                        </Link>
                        <button onClick={() => deleteItem(item.id)} style={{ marginTop: "30px" }}>
                          <div style={{ display: "flex", alignItems: "center", color: "#6B7280" }}>
                            <Trash size={26} />
                            <span>{" "}Remove</span>
                          </div>
                        </button>
                      </td>


                      {/* </Link>  */}
                      <td style={{ background: "", width: "20%", color: "#000" }}>
                        {/* <button onClick={() => deleteItem(item.id)}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Trash size={36} />
                            <span>{"  "}Remove</span>
                        </div>
                        </button> */}
                        <Button
                          onClick={() => addToCart(item.variant_id, 1, item.id)}
                          className="custom-button"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "5px" }} /> Add to Cart
                        </Button>



                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "", width: "100%" }}>
          {!customer?.id && <SignInPrompt />}
          <EmptyCartMessage />
        </div>
      )}
    </div>
  );

}

export default WishlistTemplate
