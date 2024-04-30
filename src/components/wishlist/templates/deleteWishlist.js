// Import necessary libraries and initialize Medusa client
import { RegisterOptions } from "react-hook-form"; // Not used in this snippet
import Medusa from "@medusajs/medusa-js";
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Define an asynchronous function to delete a wishlist item
export const deleteWishlist = async (id) => {
    try {
        // Logging the id of the item to be deleted for debugging purposes
        console.log("id at delete", id);

        // Making a DELETE request using axios to remove the wishlist item
        // The item to be deleted is identified by its id
        const deleteResponse = await axios.delete(`${MEDUSA_BACKEND_URL}/store/wishlist?id=${id}`, {
            headers: {
                'Content-Type': 'application/json' // Setting the content type to JSON
            }
        });

        // Logging the response from the server after deleting the item
        console.log("Response data: DELETE ", deleteResponse);
    } catch (error) {
        // Catching and logging any errors that occur during the HTTP request
        console.error("Error:", error);
    }
};
