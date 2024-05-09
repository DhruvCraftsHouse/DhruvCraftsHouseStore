import React, { useState } from 'react';
import { Button } from "@medusajs/ui";
import { useCheckout } from "@/lib/context/checkout-context";
import { PaymentSession } from "@medusajs/medusa";
import { useCart } from "medusa-react";
import axios from 'axios'; // Make sure Axios is imported

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null;
};

const Razor: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const { cart } = useCart();

  const notReady = !cart || !cart.shipping_address || !cart.billing_address || !cart.email || cart.shipping_methods.length < 1;

  return <PhonePeButton notReady={notReady} />;
};

const PhonePeButton = ({ notReady }: { notReady: boolean }) => {
  const { cart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const { onPaymentCompleted } = useCheckout();

  const handlePayment = async () => {
    if (!cart || !cart.billing_address) {
      console.error('No cart or billing address available');
      return;
    }

    console.log("Clicked PhonePeButton handlePayment", cart);
    const fullName = `${cart.billing_address.first_name} ${cart.billing_address.last_name}`;
    const amount = cart.total;
    const phoneNumber = cart.billing_address.phone;

    const data = {
      name: fullName,
      amount: 1,
      number: phoneNumber,
      MUID: "MUID" + Date.now(),
      transactionId: 'T' + Date.now()
    };

    console.log('Payment data:', data);

    try {
    //   setSubmitting(true);
      const response = await axios.post('http://localhost:9000/store/payment', data);
      console.log('response phonepe', response)
      const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
      console.log('Redirect URL:', redirectUrl);

      // Perform the redirection
      window.open(redirectUrl, '_blank');

     // Set a timeout to check the payment status after 2 minutes
     setTimeout(() => {
        checkPaymentStatus(data.transactionId);
      }, 60000); // 120000 milliseconds = 2 minutes
      //   onPaymentCompleted(); // Trigger any follow-up action after payment
    } catch (error) {
      console.error('Error during payment:', error);
    } finally {
    //   setSubmitting(false);
    //   onPaymentCompleted();
    //   setSubmitting(true);

    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
        // This should point to the URL where your server is running.
        // If running locally and the server port is 5000, use localhost:5000
        const statusResponse = await axios.get(`http://localhost:5000/checkTransactionStatus`, {
            params: { transactionId }
        });
        console.log('Payment status response:', statusResponse.data);
        if (statusResponse.data.status === 'success') {
            onPaymentCompleted(); // Assuming this function handles what happens after payment is confirmed
        } else {
            console.error('Payment status:', statusResponse.data.status);
        }
    } catch (error) {
        console.error('Error checking payment status:', error);
    }
};


  return (
    <Button
      disabled={notReady || submitting}
      isLoading={submitting}
      onClick={handlePayment}
      size="large"
    >
      Pay Now
    </Button>
  );
};

export default Razor;
