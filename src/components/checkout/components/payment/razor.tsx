import React, { useState, useEffect } from 'react';
import { Button } from "@medusajs/ui";
import { useCheckout } from "@/lib/context/checkout-context";
import { PaymentSession } from "@medusajs/medusa";
import { useCart } from "medusa-react";
import axios from 'axios'; // Make sure Axios is imported
import { MEDUSA_BACKEND_URL } from '@/lib/config';

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null;
};

type ModalProps = {
    message: string;
    onClose: () => void;
    isSuccess: boolean;
  };
  
  const Modal: React.FC<ModalProps> = ({ message, onClose, isSuccess }) => (
    <div style={{
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      backgroundColor: 'white',
      padding: '20px',
      zIndex: 1000,
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: `3px solid ${isSuccess ? 'green' : 'red'}`, // Conditional border color
      color: isSuccess ? 'green' : 'red', // Conditional text color
      overflow: 'hidden'
    }}>
      <button onClick={onClose} style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        color: isSuccess ? 'green' : 'red'  // Conditional button color
      }}>
        &#x2715;
      </button>
      <p>{message}</p>
    </div>
  );

const Razor: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const { cart } = useCart();

  const notReady = !cart || !cart.shipping_address || !cart.billing_address || !cart.email || cart.shipping_methods.length < 1;

  return <PhonePeButton notReady={notReady} />;
};

const PhonePeButton = ({ notReady }: { notReady: boolean }) => {
    const { cart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [buttonText, setButtonText] = useState('Pay Now');
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
    const { onPaymentCompleted } = useCheckout();
  
    const handlePayment = async () => {
      if (!cart || !cart.billing_address) {
        console.error('No cart or billing address available');
        return;
      }
  
      const fullName = `${cart.billing_address.first_name} ${cart.billing_address.last_name}`;
      const amount = cart.total;
      const phoneNumber = cart.billing_address.phone;
  
      const data = {
        name: fullName,
        amount: amount,
        number: phoneNumber,
        MUID: "MUID" + Date.now(),
        transactionId: 'T' + Date.now()
      };
  
      setSubmitting(true);
      try {
        const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/payment`, data);
        const { merchantTransactionId } = response.data.data;
        setTransactionId(merchantTransactionId);
        console.log(`Response from PhonePe from : ${MEDUSA_BACKEND_URL}/store/payment`, response);
        console.log('response.data.data.instrumentResponse.redirectInfo.url', response.data.data.instrumentResponse.redirectInfo.url)
        onPaymentCompleted();

        window.open(response.data.data.instrumentResponse.redirectInfo.url, '_blank');

        setButtonText('Processing Payment...');

        // Initial check after 1 minute
        setTimeout(() => checkPaymentStatus(merchantTransactionId), 60000);
      } catch (error) {
        console.error('Error during payment:', error);
        setModalMessage('Error during payment. Please try again.');
        setShowModal(true);
      } finally {
        setSubmitting(false);
      }
    };

    const checkPaymentStatus = async (transactionIdToCheck: string) => {
        if (!transactionIdToCheck) {
          console.error('No transaction ID to check status for');
          return;
        }

        console.log("Checking payment status for transaction ID:", transactionIdToCheck);
    
        try {
          const statusResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/checkTransactionStatus`, {
            params: { transactionId: transactionIdToCheck }
          });

          console.log('Payment status response:', statusResponse.data);
          switch (statusResponse.data.code) {
            case 'PAYMENT_SUCCESS':
              console.log('Payment successful');
              setShowModal(true);
              setIsSuccess(true);
              setModalMessage('Payment successful.');
              // clearInterval(pollingInterval);
              setButtonText('Paid');
              onPaymentCompleted();
              break;
            case 'PAYMENT_ERROR':
            case 'TIMED_OUT':
                setShowModal(true);
                setIsSuccess(false);
                setModalMessage('Payment failed or timed out. Please try again.');
              console.log('Payment failed or timed out.');
              setButtonText('Pay Now');
              onPaymentCompleted();
              // clearInterval(pollingInterval);
              break;
            case 'PAYMENT_PENDING':
                setButtonText('Paying...');
                onPaymentCompleted();
              console.log('Payment still pending.');
              break;
            default:
                setIsSuccess(false);
                setShowModal(true);
                onPaymentCompleted();
                setModalMessage('Unknown payment status. Please try again.');
              console.log('Unknown status:', statusResponse.data.code);
              // clearInterval(pollingInterval);
              break;
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          // clearInterval(pollingInterval);
        }
    };

    const pollingInterval = setInterval(() => {
      if (transactionId) {
        checkPaymentStatus(transactionId);
      } else {
        clearInterval(pollingInterval);
      }
    }, 10000); // Poll every 10 seconds

    // Clean up the interval on component unmount
    useEffect(() => {
      return () => {
        clearInterval(pollingInterval);
      };
    }, []);

    return (
        <>
      <Button
        disabled={notReady || submitting}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
      >
        {buttonText}
      </Button>
      {showModal && 
      <Modal message={modalMessage} onClose={() => setShowModal(false)} isSuccess={isSuccess} />
      }
    </>
    );
};


export default Razor;
