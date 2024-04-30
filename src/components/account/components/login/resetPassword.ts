"use server"; 
//  This line might be a comment or a directive, but it seems incomplete or unclear

// Importing the RegisterOptions type from "react-hook-form"
import { RegisterOptions } from "react-hook-form";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Defining the interface for NameData
interface NameData {
  name: string;
}

// Async function to reset the password
export const resetPassword = async (email: any, password: any) => {
  try {
    // Logging that the code is running on the server
    console.log("Running on server");

    // Convert email to lowercase for consistency
    const lowerCaseEmail = email.toLowerCase();

    // Logging the email and password for debugging purposes
    console.log(" email reset", lowerCaseEmail);
    console.log(" password reset", password);

    console.log('MEDUSA_BACKEND_URL', process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL)
    // Making an HTTP POST request to the Medusa server to reset the password
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: lowerCaseEmail,
        password: password, // Including the password in the request body
      }),
    });

    // Checking if the request was successful
    if (response.ok) {
      // Logging the server response on success
      console.log("response ", response);
      const result = await response.json();
      console.log("Server response:", result);
    } else {
      // Logging an error message if the request was not successful
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    // Logging any errors that occur during the process
    console.error("Error:", error);
  }
};
