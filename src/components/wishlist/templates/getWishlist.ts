// "use server";
// Importing necessary modules and initializing Medusa client
import { RegisterOptions } from "react-hook-form"; // This import is not used in the snippet
import Medusa from "@medusajs/medusa-js";
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Interface for NameData (not used in the function)
interface NameData {
  name: string;
}

// Asynchronous function to get the wishlist for a customer
export const getWishList = async (customer_id: any) => {
  try {
    // Making a GET request using axios to retrieve wishlist data for a given customer ID
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}`);

    // Logging the response data for debugging purposes
    // console.log("Get Response data GET WISHLIST:", response.data);

    // Returning the response data (the wishlist)
    return response.data;
  } catch (error) {
    // Catching and logging any errors that occur during the HTTP request
    console.error("Error:", error);
  }
};
