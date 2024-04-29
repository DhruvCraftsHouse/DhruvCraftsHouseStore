// Import necessary libraries and initialize Medusa client
// import { RegisterOptions } from "react-hook-form"; // Not used in this snippet
import Medusa from "@medusajs/medusa-js";
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Define an asynchronous function to check if a product variant is in the wishlist
export const getWishListItem = async (customer_id, variantId) => {
    try {
        // Make a GET request using axios to check for a specific product variant in the wishlist
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}&variant_id=${variantId}`);
 
        // If the wishlist item does not exist, the length of the data will be 0
        if (response.data.data.length === 0) {
            // console.log("Product does not exist");
            return false; // Return false indicating the product variant is not in the wishlist
        }
        return true; // Return true indicating the product variant is in the wishlist
    } catch (error) {
        // Catch and log any errors that occur during the HTTP request
        console.error("Error:", error);
    }
};
