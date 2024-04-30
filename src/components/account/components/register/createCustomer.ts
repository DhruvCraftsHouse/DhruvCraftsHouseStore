import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from '@/lib/context/account-context';
import { sendEmail } from './sendEmail'; 
import { medusaClient } from '@/lib/config';

export const useCreateCustomer = () => {
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { loginView, refetchCustomer } = useAccount();

  const handleError = (e: Error) => {
    setAuthError("An error occurred. Please try again.");
  };

  const createCustomer = async (credentials: any) => {
    try {
      console.log("Running on server");
      console.log("credentials at create customer", credentials);

      await sendEmail(credentials);
      await medusaClient.customers
        .create(credentials)
        .then(() => {
          refetchCustomer();
          console.log("First name:", credentials.first_name);
          console.log("Last name:", credentials.last_name);
          console.log("Email:", credentials.email);
          if (credentials.email === "roshinitharanair@gmail.com") {
            console.log("navigating");
            router.push("http://localhost:7001/a/customers?offset=0&limit=15");
            console.log("Navigation complete");
          } else {
            router.push("/account");
          }
        })
        .catch(handleError);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return { authError, createCustomer };
};
