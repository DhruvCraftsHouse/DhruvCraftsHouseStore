// Importing necessary modules and initializing Medusa client
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Initialize Medusa client with your local server's URL and a maximum retry limit
// const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

// Interface for NameData (not used in the function)
// interface NameData {
//   name: string;
// }

// Asynchronous function to get the Reviews for a customer
export const getReviews = async (product_id: any) => {
  try {
    // Check if product_id exists
    if (!product_id) {
      console.error("Error: product_id is missing");
      return null; // Return null or handle the error as needed
    }

    // Making a GET request using axios to retrieve Reviews data for a given product ID
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/comments?product_id=${product_id}`);

    // Logging the response data for debugging purposes
    // console.log("Get Response data GET Reviews changed:", response.data.data);

    // Returning the response data (the Reviews)
    if (response && response.data && response.data.data) {

    return response.data.data;
    }
  } catch (error) {
    // Catching and logging any errors that occur during the HTTP request
    console.error("Error: Review", error);
    // You can also return an error message or handle the error as needed
    return null;
  }
};