import { Heading } from "@medusajs/ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRef } from "react";
import emailjs from 'emailjs-com';
import { Container, Row, Col } from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormEvent } from "react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ContactForm from "./ContactForm.client";

// This is your Client Component, which should be in a separate file (e.g., ContactForm.client.tsx)
// const ContactForm = dynamic(() => import('./ContactForm.client'), {
//   suspense: true,
// });
// const ContactForm = dynamic(() => import('./ContactForm.client'));


const ThirdPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4" style={{ fontFamily: "AvenirNextCyr-Regular", color: "black", fontWeight: 500, fontSize: "32px", textTransform: "uppercase", letterSpacing: "0.2em" }}>
          CONNECT WITH US
        </Heading>

        <Heading level="h1" className="mb-4" style={{ fontFamily: "AvenirNextCyr-Regular", color: "black", fontWeight:  500, fontSize: "12px" }}>
  fields marked <span style={{ color: 'red' }}>*</span> are required.
</Heading>

        {/* <Suspense fallback={<div>Loading...</div>}> */}
          <ContactForm />
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default ThirdPage;