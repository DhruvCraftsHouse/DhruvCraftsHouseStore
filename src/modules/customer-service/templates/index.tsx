"use client";

import React, { useEffect, useState } from 'react';
import ContactTemplate from '../contact/templates';
import PrivacyPolicyTemplate from '../privacypolicy/templates';
import RefundandCancellationTemplate from '../refundandcancellation/templates';
import ShippingandDeliveryTemplate from '../shippinganddelivery/templates';
import TermsandConditionsTemplate from '../termsandconditions/templates';
import { useRouter, useParams } from "next/navigation";

const CustomerServiceTemplate = () => {

    const router = useRouter();
    const params = useParams();
     
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    // Function to update the state with the current hash value
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);

    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Initial set of the hash value
    handleHashChange();

    // Cleanup listener on component unmount
    return () => window.removeEventListener('hashchange', handleHashChange);
}, [params]);

  // Render the template based on the currentHash
  const renderTemplate = () => {
    switch (currentHash) {
      case '#contact':
        return <ContactTemplate />;
      case '#privacypolicy':
        return <PrivacyPolicyTemplate />;
      case '#refundandcancellation':
        return <RefundandCancellationTemplate />;
      case '#shippinganddelivery':
        return <ShippingandDeliveryTemplate />;
      case '#termsandconditions':
        return <TermsandConditionsTemplate />;
      default:
        // Optional: render a default or a not found template
        return <div>Loading policies...</div>;
    }
  };

  return (
    <div className="h-auto w-full border-b border-ui-border-base relative flex flex-col" style={{ fontFamily: "Warnock Pro Display",background: "#F5F6FA" }}>
      {renderTemplate()}
    </div>
  );
};

export default CustomerServiceTemplate;
