"use client"

import React from "react";
import { useAccount } from "@/lib/context/account-context";
import ProfileEmail from "@/components/account/components/profile-email";
import ProfileName from "@/components/account/components/profile-name";
import ProfilePassword from "@/components/account/components/profile-password";
import ProfileBillingAddress from "../components/profile-billing-address";
import ProfilePhone from "../components/profile-phone";
import Spinner from "@/components/common/icons/spinner"; // Adjust the import path as needed

const ProfileTemplate = () => {
  const { customer, retrievingCustomer } = useAccount();

  // Render Spinner while retrieving customer data
  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Spinner size={36} /> {/* Adjust Spinner usage as per your implementation */}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email,
          and phone number. You can also update your billing address or change
          your password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        <ProfilePassword customer={customer} />
        <Divider />
        <ProfileBillingAddress customer={customer} />
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />;
};

export default ProfileTemplate;
