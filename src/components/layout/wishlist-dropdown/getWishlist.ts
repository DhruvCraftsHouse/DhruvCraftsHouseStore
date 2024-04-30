// Directive indicating that this code should be run on the server side
"use server";

// Importing necessary utilities from react-hook-form and axios
import { RegisterOptions } from "react-hook-form"; // Not used in this snippet
import Medusa from "@medusajs/medusa-js"; // Importing Medusa, a headless commerce framework
import axios from 'axios'; // Importing axios for making HTTP requests
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initializing the Medusa client with the local server's URL and a maximum retry limit
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Interface declaration for NameData
interface NameData {
  name: string; // Defines a 'name' field of type string
}

// Asynchronous function to get a wishlist by a customer's ID
export const getWishList = async (customer_id: any) => {
  try {
    // Making a GET request using axios to the local server's wishlist endpoint
    // It appends the customer ID as a query parameter to the URL
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}`);

    // Logging the response data to the console for debugging purposes
    // console.log("Get Response data GET WISHLIST:", response.data);

    // Return the data obtained from the response
    return response.data;
  } catch (error) {
    // Catching and logging any errors that occur during the request
    console.error("Error:", error);
  }
};
