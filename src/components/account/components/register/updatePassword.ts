"use server";
import FloatingLabelInput from "./FloatingLabelInput"
import { RegisterOptions } from "react-hook-form";
// import Medusa from "@medusajs/medusa-js"
// const medusa = new Medusa({ baseUrl: "http://localhost:9000", maxRetries: 3 })
// // must be previously logged
// medusa.customers.retrieve()
// .then(({ customer }) => {
//   console.log("customer id",customer.id);
// })
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@/lib/config";

interface NameData {
  name: string;
}

export const updatePassword = async (email: any, password: any) => {
  try {
    // console.log("Running on server");
 
    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();
 
    // console.log(" email reset new medusa verify", lowerCaseEmail);
    // console.log(" password reset", password);
 
    // Example of setting MEDUSA_BACKEND_URL
    // const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || MEDUSA_BACKEND_URL;

    // Make HTTP POST request
    const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/updatepassword`, {
      email: lowerCaseEmail,
      password: password, // Add this line
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    // Check if the request was successful
    if (response.status === 200) {
      // console.log("Server response:", response.data);
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
