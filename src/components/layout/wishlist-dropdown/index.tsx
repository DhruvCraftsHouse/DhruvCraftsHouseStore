// Import necessary hooks, components, and /libraries
import React, { useState, useEffect, Fragment } from 'react';
import { Popover, Transition } from "@headlessui/react"
import { useStore } from "@/lib/context/store-context"
import useEnrichedLineItems from "@/lib/hooks/use-enrich-line-items"
import Button from "@/components/common/components/button"
import LineItemOptions from "@/components/common/components/line-item-options"
import LineItemPrice from "@/components/common/components/line-item-price"
import Trash from "@/components/common/icons/trash"
import Thumbnail from "@/components/products/components/thumbnail"
import { formatAmount, useCart } from "medusa-react"
import Link from "next/link"
import Wishlist from "@/components/common/icons/wishlist"
import { getWishList } from "./getWishlist";
import Medusa from "@medusajs/medusa-js";
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context"
import { useMeCustomer } from "medusa-react"
import LoadingSpinner from '@/components/loader'; // Ensure this path matches where your LoadingSpinner component is located.
import { usePathname, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { deleteWishlist } from '@/components/wishlist/templates/deleteWishlist';
import './WishlistDropdown.css'
import { MEDUSA_BACKEND_URL } from '@/lib/config';

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

// Initialize Medusa client
const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

function generateId() {
  const timestamp = new Date().getTime(); // Current time in milliseconds
  const randomNum = Math.floor(Math.random() * 1000); // Random number for extra uniqueness
  return `${timestamp}-${randomNum}`;
}
interface WishlistDropdownProps {
  isSideMenuOpen: boolean;
  // Include other props as needed
}

// Define the WishlistDropdown component
const WishlistDropdown: React.FC<WishlistDropdownProps> = ({ isSideMenuOpen }) => {
  // State and hooks for managing wishlist and UI state
  // const items = useEnrichedLineItems();
  const { deleteItem } = useStore();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { listItems, setListItems } = useWishlistDropdownContext();


  const { customerId, setCustomerId, totalItems, setTotalItems } = useWishlistDropdownContext();
  //   const { cart, totalItems } = useCart()
  //   console.log("cart ",cart)
  const { customer, isLoading } = useMeCustomer()

  // Retrieve customer ID from session storage
  useEffect(() => {

    const fetchData = async () => {

      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer?.id}`);

      // Logging the response data for debugging purposes
      // console.log(" Response data dropdown:", response.data);
      setTotalItems(response.data.wishlist.length);
      if (response.data.wishlist && Array.isArray(response.data.wishlist)) {
        response.data.wishlist.forEach((item: FavoriteItem) => {
          // console.log("favorite item ", item)
          medusa.products.variants.retrieve(item.variant_id)
            .then(({ variant }) => {
              // console.log("variant ",variant.product?.title)
              // console.log("variant ",variant.product?.thumbnail)

            })
        })
      }

    }

    if(customer && customer.id)
    {
      fetchData();

    }

  })


  // Async function to handle fetching wishlist data
  const handleData = async () => {
    const dataCreated = await getWishList(customer?.id);
    return dataCreated;
  };


  useEffect(() => {
    // Function to retrieve product variant details and return a ListItem
    const getListItem = async (item: FavoriteItem): Promise<ListItem> => {
      // console.log("wishlist id ", item.id)
      // console.log("get wishlist item ")
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

    const fetchWishlist = async () => {
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer?.id}`);
      if (response && response.data && response.data.wishlist && Array.isArray(response.data.wishlist)) {
        const wishlistPromises = response.data.wishlist.map(getListItem);
        const wishlistItems = await Promise.all(wishlistPromises);
        setListItems(wishlistItems);
      }
    };

    if(customer && customer.id)
    {
      fetchWishlist();

    }
    // console.log(listItems)
  }, [customer?.id, setListItems]);


  const handleDelete = async (id: any) => {
    // Call the delete function to remove the item from the backend
    await deleteWishlist(id);

    // Update the totalItems count
    setTotalItems(currentTotalItems => currentTotalItems - 1);

    // Update wishlistItems by removing the deleted item
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));

    // Update listItems in the context in a similar way
    setListItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  //  useEffect(() => {
  //   console.log("wishlistSet ",wishlistSet);
  //   localStorage.setItem('wishlistSet', JSON.stringify(wishlistSet));

  //  }, [wishlistSet]);



  const { state, open, close } = useWishlistDropdownContext()
  const pathname = usePathname();
  // console.log('pathname', pathname)
  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  // console.log('clickedPath', clickedPath)
  // Initialize clickedPath with the current pathname when the component mounts
  useEffect(() => {
    setClickedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    // Determine if navigation is occurring
    setIsNavigating(pathname !== clickedPath);
  }, [pathname, clickedPath]);

  // Function to handle link clicks
const handleLinkClick = (targetPath: string) => {
  // console.log("Link clicked with path:", targetPath);
  setClickedPath(targetPath); // Update clickedPath to the target path
  setIsNavigating(true); // Assume navigation is starting
};
 
const transformThumbnailUrl = (url: string | null): string => {
  if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
  return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
};

  // Render the WishlistDropdown component
  return (
    <>
    {isNavigating && <LoadingSpinner />}
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close} >
      {/* Popover for the wishlist dropdown */}
      <Popover className="relative h-full">
        {/* Popover component from Headless UI for creating a dropdown effect */}
        <Popover.Button className="h-full" >
        <div className="relative flex items-center">
  <Link href="/wishlist" className="" 
            //  onClick={ ()=> handleLinkClick('/wishlist') } 
             >
    {isSideMenuOpen ? "FAVORITES" : "Favorites"}
  </Link>

  {totalItems > 0 && (
    <span className="avatar">{totalItems}</span>
  )}
</div>





        </Popover.Button>

        {/* Conditional rendering of the Popover Panel based on the showDropdown state */}
        {/* Transition component for smooth opening and closing animations */}
        {totalItems != null && (

        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          {/* Popover Panel that shows the wishlist items */}
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[382px] text-gray-900"
          >
            {/* Header for the wishlist panel */}
            <div className="p-4 flex flex-col items-center justify-center">
              {totalItems > 0 ? (
                <h3 className="text-large-semi">{`${customer?.first_name}'s Wishlist`}</h3>
              ) : (
                <>
                  <h3 className="text-large-semi">No Items in Wishlist</h3>
                  {/* Explore Products Button */}
                  <Link href="/store" passHref
                //  onClick={ ()=> handleLinkClick('/store') } 
                  >
                    <Button className='mt-5  py-2 px-4 rounded'>
                      Explore Products
                    </Button>
                  </Link>
                </>

              )}
            </div>

            {/* Container for wishlist items */}
            <div className="p-2 grid grid-cols-1 gap-4">
            {listItems.slice(0, 3).map((item) => (
              <div key={item.id} className="wishlist-item">
                {/* Thumbnail of the product */}
                {item.thumbnail && (
                  <img src={transformThumbnailUrl(item.thumbnail)} alt={item.title} className="thumbnail" />
                )}
                {/* Product title */}
                <p className="title">{item.title}</p>
                {/* Delete button */}
                <button onClick={() => handleDelete(item.id)} className="delete-button">
                  <Trash size={26} />
                  <span> Remove</span>
                </button>
              </div>
            ))}
          </div>
            {totalItems > 0 && (
              <Link href="/wishlist" passHref
              // onClick={ ()=> handleLinkClick('/wishlist') } 
              >
                <Button className='mt-5 py-2 px-4 rounded'>
                  Explore Wishlist
                </Button>
              </Link>
            )}


          </Popover.Panel>
        </Transition>
              )}

      </Popover>
    </div>
    </>
  )
}

export default WishlistDropdown
