// Directive indicating that this code should be run on the server side
// "use server";

// Import necessary utilities
import { RegisterOptions } from "react-hook-form"; // Not used in this snippet
import axios from 'axios'; // Importing axios for making HTTP requests
import { MEDUSA_BACKEND_URL } from "@/lib/config";
// Interface declaration for NameData (unused in this function)
interface NameData {
  name: string;
}

// Asynchronous function to send an email
export const sendEmail = async (order: any) => {
  try {
    // Logging the order object to the console for debugging
    console.log("order at email", order);

    // Making a POST request using axios to send the order data to a server endpoint
    const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/orderEmail`, {
      order: order // Sending the order object in the request body
    }, {
      headers: {
        "Content-Type": "application/json", // Setting the content type to JSON
      },
    });

    // Check if the HTTP request was successful (response status 200)
    if (response.status === 200) {
      // If successful, log the server's response data
      console.log("Server response at sendEmail:", response.data);
    } else {
      // If not successful, log the error status and message
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    // Catch and log any errors that occur during the HTTP request
    console.error("Error:", error);
  }
};
