// Importing necessary modules and libraries
"use server"; // Note: This line might be a comment or a directive, but it seems incomplete or unclear

// Importing types from "react-hook-form"
import { RegisterOptions } from "react-hook-form";

// Importing the Medusa client from "@medusajs/medusa-js"
import Medusa from "@medusajs/medusa-js";

// Creating an instance of the Medusa client with a base URL and maximum retry attempts
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Importing the axios library for making HTTP requests
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Defining the interface for NameData
interface NameData {
  name: string;
}

// Async function to get wishlist data based on customer ID
export const getWishList = async (customer_id: any) => {
  try {
    // Making an HTTP GET request to the Medusa server to retrieve wishlist data
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}`);
    
    // Logging the data received from the server
    console.log("Get Response data GET WISHLIST:", response.data);
    
    // Returning the response data
    return response.data;
  } catch (error) {
    // Handling errors and logging them
    console.error("Error:", error);
  }
};
