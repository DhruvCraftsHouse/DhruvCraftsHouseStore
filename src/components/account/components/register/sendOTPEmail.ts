// Import necessary modules and packages
"use server";
// import { RegisterOptions } from "react-hook-form";
import * as nodemailer from 'nodemailer';

// Define an interface for the NameData
interface NameData {
  name: string;
}

// Function to send OTP via email
export const sendOTPEmail = async (email: any, otp: any) => {
  try {
    // Log that the function is running on the server
    console.log("Running on server");
    // Log the email and OTP for debugging purposes
    console.log("credentials at email", email);
    console.log("otp ", otp);

    // Commenting out HTTP POST request, assuming it's not needed for now
   
    // Log email and OTP at the server
    console.log("email at server from another  otp ", email, "otp ", otp);

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_GMAIL_USER,
        pass: process.env.NODEMAILER_GMAIL_PASSWORD
      }
    });

    // Define mail options for sending OTP
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL_USER,
      to: email,
      subject: "Register with OTP",
      html: `
        <div style="background-color: white; color: #000; padding: 50px; ">
          <p style="font-weight: bold; margin-bottom: 20px; font-size: 20px;">Your OTP is ${otp}.</p>
        </div>
      `
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error:", error);
  }
};
