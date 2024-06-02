"use server";

// import { RegisterOptions } from "react-hook-form";
import * as nodemailer from 'nodemailer';
// import * as https from 'https'; // Import the https module

// Define an interface for the data expected in the sendEmail function
interface NameData {
  name: string;
}

// Export the sendEmail function as a module
export const sendEmail = async (credentials: any) => {
  // Define a helper function for redirecting
  const redirect = (url: any, asLink = true) =>
    asLink ? (window.location.href = url) : window.location.replace(url);

  try {
    // console.log("Running on server");
    // console.log("credentials at sendEmail", credentials);

    // Extract email and first_name from credentials
    const email = credentials.email;
    const first_name = credentials.first_name;

    // console.log("email at server registration", email, " name ", first_name);

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

    // Create mail options for sending a welcome email
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL_USER,
      to: email,
      subject: "Thank you for registering with us.",
      html: `
        <div style="background-color: #8a5436; color: #522a14; padding: 50px; text-align: center;">
          <div style="background-color: #fafafa; color: #522a14; padding: 50px; text-align: center;">
            <img src="https://www.kamyaarts.com/cdn/shop/files/IMG_3719.jpg?v=1696598913&width=390" alt="Dhruv Crafts House Logo" style="width: 500px; height: auto;">
            <h1 style="font-weight: 500; margin-bottom: 20px; font-style: italic; font-size: 26px;">Welcome to Dhruv Crafts House, ${first_name}.</h1>
            <p style="font-weight: bold; margin-bottom: 20px; font-size: 26px;"> We're glad to have you on board.</p>
          </div>
        </div>
      `
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email ", error);
      } else {
        console.log("Email sent: ", info.response);

        // Check if the email is from roshinitharanair@gmail.com
        if (email === 'roshinitharanair@gmail.com') {
          // Make a GET request to the desired URL
          redirect("https://google.com");
        }
      }
    });

  } catch (error) {
    console.error("Error: at email creation", error);
  }
};
