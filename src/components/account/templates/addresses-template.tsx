"use client"

import React from "react"; // Ensure React is in scope when using JSX
import { useAccount } from "@/lib/context/account-context";
import AddressBook from "../components/address-book";
import Spinner from "@/components/common/icons/spinner"; // Assuming Spinner is located in @modules/common/icons

const AddressesTemplate = () => {
  const { customer, retrievingCustomer } = useAccount();

  // Display Spinner when data is being loaded or no customer data is available
  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Spinner size={36} /> {/* Example usage of Spinner with a size prop */}
      </div>
    );
  }

  // Render the address book once data is available
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Shipping Addresses</h1>
        <p className="text-base-regular">
          View and update your shipping addresses, you can add as many as you
          like. Saving your addresses will make them available during checkout.
        </p>
      </div>
      <AddressBook customer={customer} />
    </div>
  );
};

export default AddressesTemplate;
