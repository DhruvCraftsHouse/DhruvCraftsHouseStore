// Import necessary utilities and initialize Medusa client
// import { RegisterOptions } from "react-hook-form"; // Not used in this snippet
import Medusa from "@medusajs/medusa-js";
import axios from 'axios';
import { getWishListItem } from "./getWishListItem";
import { getIdWishList } from "./getIdWishlist";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Define an asynchronous function to post to wishlist or delete from it
export const postToWishlist = async (customer_id, customer_email, variantId) => {
    try {
        // Log to indicate the start of the posting process
        // console.log("in posting");

        // Check if the item is already in the wishlist
        const getData = await getWishListItem(customer_id, variantId);
        // console.log("get data post ", getData);

        if(getData) {
            // If the item exists in the wishlist, get its ID
            const id = await getIdWishList(customer_id, variantId);
            // console.log("id at delete", id);
  
            // Delete the wishlist item using HTTP DELETE request
            const deleteResponse = await axios.delete(`${MEDUSA_BACKEND_URL}/store/wishlist?id=${id}`, {
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {
                  customer_id: customer_id,
                  variant_id: variantId,
                  email: customer_email
                }
            });
  
            // Log the response from the server after deleting
            // console.log("Response data: DELETE ", deleteResponse.data);
        } else {
            // If the item does not exist in the wishlist, add it using HTTP POST request
            const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/wishlist`, {
                customer_id: customer_id,
                variant_id: variantId,
                email: customer_email
            });
     
            // Log the response from the server after posting
            // console.log("Response data: POST ", response.data);
        }
    } catch (error) {
        // Catch and log any errors that occur during the HTTP request
        console.error("Error:", error);
    }
};
