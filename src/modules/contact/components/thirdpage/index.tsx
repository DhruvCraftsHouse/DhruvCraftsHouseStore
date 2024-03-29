import React, { useEffect, useState } from 'react';
import { Heading } from "@medusajs/ui";
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import '../Contact.css';

interface DelayedComponentProps {
  children: React.ReactNode; // This type is suitable for any valid React child
  delay: number; // Delay in milliseconds
}

// DelayedComponent wrapper with explicit types
const DelayedComponent: React.FC<DelayedComponentProps> = ({ children, delay }) => {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChild(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return showChild ? <>{children}</> : <div>Loading...</div>;
};

// Updated dynamic import with DelayedComponent
// const ContactFormWithDelay = dynamic(() => import('./ContactForm.client'), {
//   suspense: true,
// });

const ContactFormWithDelay = dynamic(() => import('@modules/contact/components/thirdpage/ContactForm.client'));

const ContactForm = () => (
  <DelayedComponent delay={500}>
    <ContactFormWithDelay />
  </DelayedComponent>
);

const ThirdPage = () => {
  return (
    <div style={{ fontFamily: "Times New Roman,serif", backgroundColor: "#FFF" }}>
      <div className="flex flex-col items-center text-center pt-12 pb-12">
        <Heading level="h1" className="mb-4 connect-class" style={{ fontFamily: "AvenirNextCyr-Regular", color: "black", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          CONNECT WITH US
        </Heading>

        <Heading level="h1" className="mb-4" style={{ fontFamily: "AvenirNextCyr-Regular", color: "black", fontWeight: 500, fontSize: "12px" }}>
          fields marked <span style={{ color: 'red' }}>*</span> are required.
        </Heading>

        <Suspense fallback={<div>Initial Loading...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
};

export default ThirdPage;
