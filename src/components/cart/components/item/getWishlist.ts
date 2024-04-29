// Use directive to indicate that this code is intended to run on a server environment
// "use server";

// Importing RegisterOptions from react-hook-form for form handling (not used in this snippet)
// import { RegisterOptions } from "react-hook-form";
// Importing Medusa, a headless commerce framework's JavaScript SDK
// import Medusa from "@medusajs/medusa-js"
// Create an instance of the Medusa client pointing to a local server
// const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// Must be logged in prior to using this (implied by the comment)

// Import axios, a promise-based HTTP client, for making HTTP requests
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Define an interface for name data, which includes a string field 'name'
// interface NameData {
//   name: string;
// }

// Define an asynchronous function to get a wishlist by customer ID
export const getWishList = async (customer_id: any) => {
  try {
    // Making a GET request using axios to fetch the wishlist for a given customer ID
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/wishlist?customer_id=${customer_id}`);

    // Logging the response data for debugging purposes
    // console.log("Get Response data GET WISHLIST:", response.data);
    // Uncommented code below is for additional logging and conditional checks (commented out)

    // Return the fetched data
    return response.data;
  } catch (error) {
    // Logging any errors that occur during the axios request
    console.error("Error:", error);
  }
};
