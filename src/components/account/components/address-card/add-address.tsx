import { medusaClient } from "@/lib/config"
import { useAccount } from "@/lib/context/account-context"
import useToggleState from "@/lib/hooks/use-toggle-state"
import CountrySelect from "@/components/checkout/components/country-select"
import Button from "@/components/common/components/button"
import Input from "@/components/common/components/input"
import Modal from "@/components/common/components/modal"
import Plus from "@/components/common/icons/plus"
import Spinner from "@/components/common/icons/spinner"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Customer } from "@medusajs/medusa"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { phonePattern, namePattern, lastNamePattern, phoneNumberPattern } from "@/lib/util/regex"

type FormValues = {
  first_name: string
  last_name: string
  city: string
  country_code: string
  postal_code: string
  province?: string
  address_1: string
  address_2?: string
  phone?: string
  company?: string
  address_name?: string
}

type AddAddressProps = {
  customer: Omit<Customer, "password_hash">
}

const AddAddress: React.FC<AddAddressProps> = ({ customer }) => {
  const { state, open, close } = useToggleState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [useSameBillingAddress, setUseSameBillingAddress] = useState(false);
  const { refetchCustomer } = useAccount()
  const [isLocationNameError, setLocationNameError] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
    setValue,
    trigger
  } = useForm<FormValues>({mode:"onChange"})

  const handleClose = () => {
    setIsSaveClicked(false);
    reset({
      first_name: "",
      last_name: "",
      city: "",
      country_code: "",
      postal_code: "",
      address_1: "",
      address_2: "",
      company: "",
      phone: "",
      province: "",
      address_name: ""
    }),
    setUseSameBillingAddress(false); // Set useSameBillingAddress to false after successful submission
    close()
  }

  const submit = handleSubmit(async (data: FormValues) => {
    setIsSaveClicked(true);

    setSubmitting(true)
    setError(undefined)

    const phoneNumberPattern = /^(\+91)?[7-9][0-9]{9}$/;
    if (!data.phone) {
      setError("Phone number is required.");
      setSubmitting(false);
      return;
    }
    if (!phoneNumberPattern.test(data.phone)) {
      setError("Invalid phone number, please enter a valid Indian phone number.");
      setSubmitting(false);
      return;
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      company: data.company || "",
      address_1: data.address_1,
      address_2: data.address_2 || "",
      city: data.city,
      country_code: data.country_code,
      province: data.province || "",
      postal_code: data.postal_code,
      phone: data.phone || "",
      metadata: {},
    }

    medusaClient.customers.addresses
      .addAddress({ address: payload })
      .then(() => {
        setSubmitting(false)
        refetchCustomer()
        handleClose()
        setUseSameBillingAddress(false); // Set useSameBillingAddress to false after successful submission
        // toast.success("Address added successfully");
      })
      .catch(() => {
        setSubmitting(false)
        setError("Failed to add address, please try again.")
      })
  })
  console.log("customer.billing_address ", customer.billing_address)
  console.log("customer.shipping ", customer.shipping_addresses)
  console.log("customer.shipping length ", customer.shipping_addresses.length)
  // Check if customer has no shipping addresses
  const shouldShowSameBillingAddress = customer.shipping_addresses.length === 0;
  // Add a useEffect hook to update form fields when useSameBillingAddress changes
  useEffect(() => {
    if (useSameBillingAddress && customer.billing_address) {
      const companyValue = customer.billing_address.company || "";
      reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
        company: companyValue,
        address_1: customer.billing_address.address_1 || "",
        address_2: customer.billing_address.address_2 || "",
        city: customer.billing_address.city || "",
        country_code: customer.billing_address.country_code || "",
        postal_code: customer.billing_address.postal_code || "",
        province: customer.billing_address.province || "",
        phone: customer.phone || "",
        
      });
      // Set error state based on the company value
    setLocationNameError(!companyValue.trim());
    } else {
      reset({
        first_name: "",
        last_name: "",
        city: "",
        country_code: "",
        postal_code: "",
        address_1: "",
        address_2: "",
        company: "",
        phone: "",
        province: "",
      });
      setLocationNameError(false);
    }
  
    // Reset isSaveClicked to false
    setIsSaveClicked(false);
  
  }, [useSameBillingAddress, customer, reset]);


  return (
    <>
      <button
        className="border border-gray-200 p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
        onClick={open}
      >
        <span className="text-base-semi">New address</span>
        <Plus size={24} />
      </button>

      <Modal isOpen={state} close={handleClose}>
        <Modal.Title>Add address</Modal.Title>
        {/* Conditionally render the checkbox */}
        {shouldShowSameBillingAddress && customer.billing_address && (
          <div className="mt-2 mb-4">
            <input
              type="checkbox"
              checked={useSameBillingAddress}
              onChange={(e) => setUseSameBillingAddress(e.target.checked)}
            />
            <label className="mt-2" style={{ fontSize: "14px" }}>Use same billing address</label>

          </div>
        )}

        <Modal.Body>
          <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-2 gap-x-2">

            <div className="input-wrapper" style={{ position: 'relative' }}>
            <div className="input-container">

              <Input
                label="First name"
                {...register("first_name", {
                  required: "First name is required" ,
                  pattern: {
                    value: namePattern,
                    message: "First name must contain only alphabetic characters"
                  }
                })}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue("first_name", e.target.value);
                  trigger("first_name");
                }}    
                required
                errors={errors.first_name}
                autoComplete="given-name"
                defaultValue={customer.first_name}
                className={`custom-input wide-input ${errors.first_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

              />
 {errors.first_name && <span className="error-icon  -mt-3">!</span>}
              </div>
              <div className="-mt-0 mb-3 pl-2 text-rose-500 text-xsmall-regular">

              {errors.first_name && <span className="-pt-3 pl-2 text-rose-500 text-xsmall-regular">{errors.first_name.message}</span>}

              </div>
</div>
<div className="input-wrapper" style={{ position: 'relative' }}>
            <div className="input-container">
   
              <Input
                label="Last name"
                {...register("last_name", {
                  required: "Last name is required" ,
              pattern: {
                value: lastNamePattern,
                message: "Last name must contain only alphabetic characters"
              }
            })}
            onChange={(e) => {
              setValue("last_name", e.target.value);
              trigger("last_name");
            }} 
                required
                errors={errors.last_name}
                autoComplete="family-name"
                defaultValue={customer.last_name}
                className={`custom-input wide-input ${errors.last_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}


              />
              {errors.last_name && <span className="error-icon -mt-3">!</span>}
              </div>
             <div className="-mt-0 mb-3 pl-2 text-rose-500 text-xsmall-regular">

              {errors.last_name && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.last_name.message}</span>}
              </div>
</div>
            </div>
            <div className="input-wrapper" style={{ position: 'relative' }}>
            <Input
  label="Location Name"
  {...register("company", {
    required: "Location is required",
  })}
  errors={errors.company}
  autoComplete="organization"
  defaultValue={useSameBillingAddress ? customer.billing_address?.company ?? "" : ""}
  onChange={(e) => {
    setValue("company", e.target.value);
    trigger("company");
    setLocationNameError(!e.target.value.trim());
  }}
  className={`custom-input wide-input ${
    errors.company || isLocationNameError
      ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0'
      : 'pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover'
  }`}
  required
/>

  {errors.company || isLocationNameError ? <span className="error-icon">!</span> : null}
</div>
{(errors.company || isLocationNameError) && (
  <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">
    {errors.company ? errors.company.message : "Location Name is required"}
  </span>
)}

              <div className="input-wrapper" style={{ position: 'relative' }}>

            <Input
              label="Address"
              {...register("address_1", {
                required: "Address is required",
              })}
              required
              errors={errors.address_1}
              autoComplete="address-line1"
              defaultValue={useSameBillingAddress ? customer.billing_address.address_1 ?? "" : ""}
              // Add conditional styling for error
              className={`custom-input wide-input ${errors.address_1 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
              // className={errors.address_1 ? "border-red-500" : "border-black border-2 w-full h-12"}
            />
           {errors.address_1 && <span className="error-icon">!</span>}
              </div>
              {errors.address_1 && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.address_1.message}</span>}
              <div className="input-wrapper" style={{ position: 'relative' }}>

            <Input
              label="Apartment, suite, etc."
              {...register("address_2", {
                required: "Address is required",
              })}
              errors={errors.address_2}
              autoComplete="address-line2"
              className={`custom-input wide-input ${errors.address_2 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
              defaultValue={useSameBillingAddress ? customer.billing_address.address_2 ?? "" : ""}
            />
            {errors.address_2 && <span className="error-icon">!</span>}
              </div>
              {errors.address_2 && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.address_2.message}</span>}
             
            <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <div className="input-wrapper" style={{ position: 'relative' }}>
            <div className="input-container">

              <Input
                label="Postal code"
                {...register("postal_code", {
                  required: "Postal Code is required", 
                  pattern: { value: /^\d{6}$/, message: "Postal code must be 6 digits" } 
                 })}
                 onChange={(e) => {
                  setValue("postal_code", e.target.value);
                  trigger("postal_code");
                }}
                required
                errors={errors.postal_code}
                autoComplete="postal-code"
                className={`custom-input wide-input ${errors.postal_code ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
                defaultValue={useSameBillingAddress ? customer.billing_address.postal_code ?? "" : ""}

              />

               {errors.postal_code && <span className="error-icon  -mt-3">!</span>}
              </div>
              <div className="-mt-0 mb-3 pl-2 text-rose-500 text-xsmall-regular">

              {errors.postal_code && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.postal_code.message}</span>}
              </div>
</div>
              <div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">

              <Input
                label="City"
                {...register("city", {
                  required: "City is required", 
 pattern: { value: /^[a-zA-Z]*$/, message: "City must contain only alphabets" } 
 })}
 onChange={(e) => {
  setValue("city", e.target.value);
  trigger("city");
}}
                errors={errors.city}
                required
                autoComplete="locality"
                defaultValue={useSameBillingAddress ? customer.billing_address.city ?? "" : ""}
                className={`custom-input wide-input ${errors.city ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

              />

               {errors.city && <span className="error-icon -mt-3">!</span>}
              </div>
              <div className="-mt-0 mb-3 pl-2 text-rose-500 text-xsmall-regular">

              {errors.city && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.city.message}</span>}
              </div>
</div>
            </div>
            <div className="input-wrapper" style={{ position: 'relative' }}>

            <Input
              label="Province / State"
              {...register("province", {
                required: "Province is required", 
                pattern: { value: /^[a-zA-Z]*$/, message: "Province must contain only alphabets" } 
                })}
                onChange={(e) => {
                  setValue("province", e.target.value);
                  trigger("province");
                }}
              errors={errors.province}
              autoComplete="address-level1"
              defaultValue={useSameBillingAddress ? customer.billing_address.province ?? "" : ""}
              className={`custom-input wide-input ${errors.province ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

            />
              {errors.province && <span className="error-icon">!</span>}
              </div>
              {errors.province && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.province.message}</span>}
              
              <div className="input-wrapper" style={{ position: 'relative' }}>
  <CountrySelect
    {...register("country_code", { required: "Country is required" })}
    autoComplete="country"
    defaultValue={useSameBillingAddress ? customer.billing_address.country_code ?? "" : ""}
    className={`custom-input wide-input ${errors.country_code ? 'error-border ' : ""}`}
  />
  {errors.country_code && <span className="error-icon">!</span>}
</div>
{errors.country_code && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.country_code.message}</span>}
<div className="input-wrapper" style={{ position: 'relative' }}>

            <Input
              label="Phone"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: phoneNumberPattern,
                  message: "Please enter phone number in format +91XXXXXXXXXX"
                }
              })}
              onChange={(e) => {
                setValue("phone", e.target.value);
                trigger("phone");
              }}
              errors={errors.phone}
              autoComplete="phone"
              defaultValue={customer.phone}
              className={`custom-input wide-input ${errors.phone ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

            />
            {errors.phone && <span className="error-icon">!</span>}
              </div>
              {errors.phone && <span className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.phone.message}</span>}
              
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <div className="mt-5">

          <Modal.Footer>

            <Button
              className="!bg-gray-200 !text-gray-900 !border-gray-200 min-h-0 w-full small:max-w-[140px]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
  variant="secondary"
  className="w-full small:max-w-[140px]"
  onClick={() => {
    setUseSameBillingAddress(false);
    reset();
    setIsSaveClicked(false);
    setLocationNameError(false); // Reset the location name error state
  }}
>
  Clear
</Button>


            <Button className="min-h-0 w-full small:max-w-[140px]" onClick={submit} disabled={submitting}>
              Save
              {submitting && <Spinner />}
            </Button>
          </Modal.Footer>
        </div>

      </Modal>
      <style>
        {`
  .custom-input {
    // font-size: 1rem;
    // padding: 10px;
  }
  .wide-input {
    width: 100%;
  }
  .normal-border {
    border: 1px solid black;
  }
  .error-border {
    border: 1px solid red;
    border-radius: 5px;
  }
  .error-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: red;
    color: white;
    font-size: 16px;
    text-align: center;
    line-height: 20px;
  }
  .error-message {
    color: red;
    font-size: 0.8rem;
    margin-top: 4px;
  }
  `}
      </style>

    </>
  )
}

export default AddAddress
