"use server"; 
//  This line might be a comment or a directive, but it seems incomplete or unclear

// Importing the RegisterOptions type from "react-hook-form"
import { RegisterOptions } from "react-hook-form";
import { MEDUSA_FRONTEND_URL, MEDUSA_BACKEND_URL } from "@/lib/config";
// Importing necessary modules for email verification
import * as nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

// Defining the interface for NameData
interface NameData {
  name: string;
}

// Function to encrypt an email by shifting character codes
function encryptEmail(email: string): string {
  let encryptedEmail = '';
  for (let i = 0; i < email.length; i++) {
    let charCode = email.charCodeAt(i);
    charCode -= 10;
    encryptedEmail += String.fromCharCode(charCode);
  }

  return encryptedEmail.toString();
}

// Async function to send a verification email
export const verifyEmail = async (email: any) => {
  try {
    // Logging that the code is running on the server
    console.log("Running on server verfiyemail", process.env.NEXT_PUBLIC_BASE_URL);

    // Hashing the email to create a secure token
    const hashedToken = await bcryptjs.hash(email.toString(), 10);

    // Encrypting the email for use in the verification link
    const encryptedEmail = encryptEmail(email);

    // Logging the encrypted email for debugging purposes
    console.log("encrypted email at verifyEmail ", encryptedEmail);

    console.log('MEDUSA_FRONTEND_URL', process.env.NEXT_PUBLIC_BASE_URL)
    // Constructing the activation link with hashed token and encrypted email
    const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verifypassword?token=${hashedToken}&verify=${encryptedEmail}`;

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Logging the email for debugging purposes
    console.log(" email verify", lowerCaseEmail);

    // Create a nodemailer transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_GMAIL_USER,
        pass: process.env.NODEMAILER_GMAIL_PASSWORD
      }
    });

    // Define the email options for nodemailer
    const mailOptions = {
      from: process.env.NODEMAILER_GMAIL_USER,
      to: lowerCaseEmail,
      subject: 'Activation Email',
      html: `
        <div style="background-color: white; color: #000; padding: 50px; ">
          <p style="margin-bottom: 20px; font-size: 20px;">
            <a href="${activationLink}">Click here to activate reset password:</a>
          </p>
        </div>
      `
    };

    // Send the email using nodemailer
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    // Logging any errors that occur during the process
    console.error("Error:", error);
  }
};
