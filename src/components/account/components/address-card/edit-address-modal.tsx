import { medusaClient } from "@/lib/config"
import { useAccount } from "@/lib/context/account-context"
import useToggleState from "@/lib/hooks/use-toggle-state"
import { Address } from "@medusajs/medusa"
import CountrySelect from "@/components/checkout/components/country-select"
import { Button, Heading, Text } from "@medusajs/ui"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import Input from "@/components/common/components/input"
import Modal from "@/components/common/components/modal"
import Spinner from "@/components/common/icons/spinner"
import clsx from "clsx"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
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
}

type EditAddressProps = {
  address: Address
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  address,
  isActive = false,
}) => {
  const { state, open, close } = useToggleState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const { refetchCustomer } = useAccount()
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
        mode:"onChange",
    defaultValues: {
      first_name: address.first_name || undefined,
      last_name: address.last_name || undefined,
      city: address.city || undefined,
      address_1: address.address_1 || undefined,
      address_2: address.address_2 || undefined,
      country_code: address.country_code || undefined,
      postal_code: address.postal_code || undefined,
      phone: address.phone || undefined,
      company: address.company || undefined,
      province: address.province || undefined,
    },
  })

  const submit = handleSubmit(async (data: FormValues) => {
    setSubmitting(true)
    setError(undefined)

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      company: data.company || "Personal",
      address_1: data.address_1,
      address_2: data.address_2 || "",
      city: data.city,
      country_code: data.country_code,
      province: data.province || "",
      postal_code: data.postal_code,
      phone: data.phone || "None",
      metadata: {},
    }

    medusaClient.customers.addresses
      .updateAddress(address.id, payload)
      .then(() => {
        setSubmitting(false)
        refetchCustomer()
        close()
      })
      .catch(() => {
        setSubmitting(false)
        setError("Failed to update address, please try again.")
      })
  })

  const removeAddress = () => {
    medusaClient.customers.addresses.deleteAddress(address.id).then(() => {
      refetchCustomer()
    })
  }

  return (
    <>
      <div
        className={clsx(
          "border rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors",
          {
            "border-gray-900": isActive,
          }
        )}
      >
        <div className="flex flex-col">
          <Heading className="text-left text-base-semi">
            {address.first_name} {address.last_name}
          </Heading>
          {address.company && (
            <Text className="txt-compact-small text-gray-700">
              {address.company}
            </Text>
          )}
          <Text className="flex flex-col text-left text-base-regular mt-2">
            <span>
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span>
              {address.postal_code}, {address.city}
            </span>
            <span>
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="text-small-regular text-gray-700 flex items-center gap-x-2"
            onClick={open}
          >
            <Edit />
            Edit
          </button>
          <button
            className="text-small-regular text-gray-700 flex items-center gap-x-2"
            onClick={removeAddress}
          >
            <Trash />
            Remove
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close}>
        <Modal.Title>
          <Heading className="mb-2">Edit address</Heading>
        </Modal.Title>
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
                onChange={(e) => {
                  setValue("first_name", e.target.value);
                  trigger("first_name");
                }} 
                required
                errors={errors.first_name}
                autoComplete="given-name"
                className={`custom-input wide-input ${errors.first_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

              />
{errors.first_name && <span className="error-icon">!</span>}
              </div>
              {errors.first_name && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.first_name.message}</span>}

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
                className={`custom-input wide-input ${errors.last_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}


              />
          {errors.last_name && <span className="error-icon">!</span>}
              </div>  
              {errors.last_name && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.last_name.message}</span>}
</div>
            </div>
  <div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">

            <Input label="Location Name" {...register("company", {
                required: "Location is required",
              })} 
              errors={errors.company}
              className={`custom-input wide-input ${errors.company ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
              required
            />
            {errors.company && <span className="error-icon">!</span>}
              </div>
              {errors.company && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.company.message}</span>}
</div>
<div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">
            <Input
              label="Address"
              {...register("address_1", {
                required: "Address is required",
              })}
              required
              errors={errors.address_1}
              autoComplete="address-line1"
              // Add conditional styling for error
              className={`custom-input wide-input ${errors.address_1 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
              // className={errors.address_1 ? "border-red-500" : "border-black border-2 w-full h-12"}
            />
           {errors.address_1 && <span className="error-icon">!</span>}
              </div>
              {errors.address_1 && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.address_1.message}</span>}
              </div>
              <div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">
            <Input
              label="Apartment, suite, etc."
              {...register("address_2", {
                required: "Address is required",
              })}
              errors={errors.address_2}
              autoComplete="address-line2"
              className={`custom-input wide-input ${errors.address_2 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
            />
            {errors.address_2 && <span className="error-icon">!</span>}
              </div>
              {errors.address_2 && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.address_2.message}</span>}
             </div>
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
              />
               {errors.postal_code && <span className="error-icon">!</span>}
              </div>
              {errors.postal_code && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.postal_code.message}</span>}
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
                className={`custom-input wide-input ${errors.city ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

              />
               {errors.city && <span className="error-icon">!</span>}
              </div>
              {errors.city && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.city.message}</span>}
              </div>
            </div>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">
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
              className={`custom-input wide-input ${errors.province ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

            />
              {errors.province && <span className="error-icon">!</span>}
              </div>
              {errors.province && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.province.message}</span>}
              </div>
              <div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">  <CountrySelect
    {...register("country_code", { required: "Country is required" })}
    autoComplete="country"
    className={`custom-input wide-input ${errors.country_code ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
  />
  {errors.country_code && <span className="error-icon">!</span>}
</div>
{errors.country_code && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.country_code.message}</span>}
</div>
<div className="input-wrapper" style={{ position: 'relative' }}>
              <div className="input-container">
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
              className={`custom-input wide-input ${errors.phone ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}

            />
            {errors.phone && <span className="error-icon">!</span>}
              </div>
              {errors.phone && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.phone.message}</span>}
              </div>
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={close} disabled={submitting}>
              Cancel
            </Button>
            <Button className="min-h-0" onClick={submit} isLoading={submitting}>
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <style>{`
      .error-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: red;
        color: white;
        font-size: 10px;
        text-align: center;
        line-height: 20px;
      }
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
      .error-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 4px;
      }
      `}</style>
    </>
  )
}

export default EditAddress
