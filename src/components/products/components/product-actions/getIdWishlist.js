// Import necessary utilities and initialize Medusa client
import Medusa from "@medusajs/medusa-js";
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Define an asynchronous function to get the ID of a wishlist item
export const getIdWishList = async (customer_id, variantId) => {
    try {
        // Making a GET request using axios to retrieve a specific wishlist item
        // for a given customer and product variant
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}&variant_id=${variantId}`);
 
        // Logging the ID of the first item in the response data for debugging
        // This assumes that the response data contains the required wishlist item
        console.log("Get Response data ID:", response.data.data[0].id);

        // Returning the ID of the wishlist item
        // This will return the ID of the first item in the array returned by the server
        return response.data.data[0].id;

    } catch (error) {
        // Catching and logging any errors that occur during the HTTP request
        console.error("Error:", error);
    }
};
