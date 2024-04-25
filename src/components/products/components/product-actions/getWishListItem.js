// Import necessary libraries and initialize Medusa client
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
// const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Define an asynchronous function to check if a product variant is in the wishlist
export const getWishListItem = async (customer_id, variantId) => {
    try {
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}&variant_id=${variantId}`);

        // Check if the data property and its nested data property exist in the response
        if (response.data && response.data.data) {
            // Now check the length
            if (response.data.data.length === 0) {
                // console.log("Product does not exist");
                return false; // Product variant is not in the wishlist
            }
            return true; // Product variant is in the wishlist
        } else {
            console.log("Response data structure is not as expected");
            return false; // Handle unexpected data structure
        }
    } catch (error) {
        console.error("Error:", error);
        return false; // Handle the error case
    }
};
