// AddToCartButton.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart, useCreateLineItem } from 'medusa-react';
import { confirmAlert } from 'react-confirm-alert';
import Button from "@/components/common/components/button";
import { deleteWishlist } from './deleteWishlist';
// import {
//     ProductProvider,
//     useProductActions,
//   } from "@lib/context/product-context"

const AddToCartButton = ({ variantId, itemId, setTotalItems, setWishlistItems, setListItems }) => {
  const { cart, totalItems } = useCart();
//   const { addToCart } = useProductActions();
  const cartId = cart?.id || '';
  const createLineItem = useCreateLineItem(cartId);

  const handleAddToCart = () => {
    confirmAlert({
      title: 'Do you want to add this to your cart',
      buttons: [
        {
          label: 'Add to Cart',
          onClick: () => {
            addToCart();
            createLineItem.mutate(
              { variant_id: variantId, quantity: 1 },
              {
                onSuccess: () => {
                  // Successfully added item to cart
                  // Remove item from wishlist
                  deleteWishlist(itemId);
                  const currentTotalItems = setTotalItems((prev) => prev - 1);
                  setWishlistItems((prevItems) => prevItems.filter(item => item.id !== itemId));
                  setListItems((prevItems) => prevItems.filter(item => item.id !== itemId));
                  window.location.href='/cart';
                },
                onError: (error) => {
                  // Handle any errors here
                  console.error('Error adding item to cart:', error);
                }
              }
            );
          },
          style: { marginRight: '20px' }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  return (
    <Button onClick={handleAddToCart} className="custom-button">
      <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: "5px" }} /> Add to Cart
    </Button>
  );
};


export default AddToCartButton;
