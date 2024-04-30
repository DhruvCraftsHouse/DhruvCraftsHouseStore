import { useAccount } from "@/lib/context/account-context"
import { Customer, StorePostCustomersCustomerReq } from "@medusajs/medusa"
import Input from "@/components/common/components/input"
import NativeSelect from "@/components/common/components/native-select"
import { useRegions, useUpdateMe } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import AccountInfo from "../account-info"
import Button from "@/components/common/components/button"
import { namePattern,addressPattern, emailPattern, lastNamePattern } from "@/lib/util/regex"


type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerNameFormData = Pick<
  StorePostCustomersCustomerReq,
  "billing_address"
>

const ProfileBillingAddress: React.FC<MyInformationProps> = ({ customer }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setFocus,
    setValue,
    trigger, // Add this line
    formState: { errors, touchedFields },
  } = useForm<UpdateCustomerNameFormData>({
    mode:"onChange",
    defaultValues: {
      ...mapBillingAddressToFormData({ customer }),
    },
  });
  

  const {
    mutate: update,
    isLoading,
    isSuccess,
    isError,
    reset: clearState,
  } = useUpdateMe()

  const { regions } = useRegions()

  const regionOptions = useMemo(() => {
    return (
      regions
        ?.map((region) => {
          return region.countries.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }))
        })
        .flat() || []
    )
  }, [regions])

  // useEffect(() => {
  //   reset({
  //     ...mapBillingAddressToFormData({ customer }),
  //   })
  // }, [customer, reset])
  useEffect(() => {
    reset({
      ...mapBillingAddressToFormData({ customer }),
    })
 
    setFocus("billing_address.first_name");
    setFocus("billing_address.last_name");
    setFocus("billing_address.address_1");
    setFocus("billing_address.address_2");
    setFocus("billing_address.postal_code");
    setFocus("billing_address.city");
    setFocus("billing_address.province");
    setFocus("billing_address.country_code");
 
       setValue("billing_address.first_name", customer.first_name, { shouldTouch: true });
  setValue("billing_address.last_name", customer.last_name, { shouldTouch: true });
  setValue("billing_address.address_1", customer.billing_address?.address_1 ?? "", { shouldTouch: true });
  setValue("billing_address.address_2", customer.billing_address?.address_2 ?? "", { shouldTouch: true });
  setValue("billing_address.postal_code", customer.billing_address?.postal_code ?? "", { shouldTouch: true });
  setValue("billing_address.city", customer.billing_address?.city ?? "", { shouldTouch: true });
  setValue("billing_address.province", customer.billing_address?.province ?? "", { shouldTouch: true });
  setValue("billing_address.country_code", customer.billing_address?.country_code ?? "-", { shouldTouch: true });


  }, [customer, reset, setFocus, setValue]);

  const { refetchCustomer } = useAccount()

  const [
    firstName,
    lastName,
    company,
    address1,
    address2,
    city,
    province,
    postalCode,
    countryCode,
  ] = useWatch({
    control,
    name: [
      "billing_address.first_name",
      "billing_address.last_name",
      "billing_address.company",
      "billing_address.address_1",
      "billing_address.address_2",
      "billing_address.city",
      "billing_address.province",
      "billing_address.postal_code",
      "billing_address.country_code",
    ],
  })

  const updateBillingAddress = (data: UpdateCustomerNameFormData) => {
    return update(
      {
        id: customer.id,
        ...data,
      },
      {
        onSuccess: () => {
          refetchCustomer()
        },
      }
    )
  }

  const currentInfo = useMemo(() => {
    if (!customer.billing_address) {
      return "No billing address"
    }


    const country =
      regionOptions?.find(
        (country) => country.value === customer.billing_address.country_code
      )?.label || customer.billing_address.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold">
        <span>
          {customer.billing_address.first_name}{" "}
          {customer.billing_address.last_name}
        </span>
        <span>{customer.billing_address.company}</span>
        <span>
          {customer.billing_address.address_1}
          {customer.billing_address.address_2
            ? `, ${customer.billing_address.address_2}`
            : ""}
        </span>
        <span>
          {customer.billing_address.postal_code},{" "}
          {customer.billing_address.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [customer, regionOptions])

  console.log("customer at profile address ", customer)

const handleClearForm = ()=>{
  //pass the clear button functions here
}
  return (
    <form
      onSubmit={handleSubmit(updateBillingAddress)}
      onReset={() => reset(mapBillingAddressToFormData({ customer }))}
      className={`w-full ${!customer.billing_address ? 'border-red-500' : ''}`}
      style={{ border: !customer.billing_address ? "1px solid red" : "" }}
    >
      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            {/* First Name Input */}
<Input
  label="First name"
  {...register("billing_address.first_name", {
    required: "First name is required",
    pattern: {
      value: namePattern,
      message: "First name must contain only alphabetic characters"
    }
  })}
  onChange={(e) => {
    setValue("billing_address.first_name", e.target.value);
    trigger("billing_address.first_name");
  }}
  defaultValue={customer.first_name}
  errors={errors}
  touched={touchedFields}
  required
/>
{errors.billing_address?.message && (
  <p className="text-red-500">{errors.billing_address.message}</p>
)}

            {/* Last Name Input */}
            <Input
              label="Last name"
              {...register("billing_address.last_name",{ required: "Last name is required" ,
              pattern: {
                value: lastNamePattern,
                message: "First name must contain only alphabetic characters"
              }
            })}
            onChange={(e) => {
              setValue("billing_address.last_name", e.target.value);
              trigger("billing_address.last_name");
            }}
              defaultValue={customer.last_name}
              errors={errors}
              touched={touchedFields}
              required
            />
            {errors.billing_address?.message && (
              <p className="text-red-500">{errors.billing_address.message}</p>
            )}

            {/* ...similarly for other fields... */}


          </div>
     
          <Input
            label="Address"
            {...register("billing_address.address_1", { required: "Address1 is required" 
          })}
            defaultValue={address1}
            errors={errors}
            touched={touchedFields}
            required
          />
          {errors.billing_address?.message && (
              <p className="text-red-500">{errors.billing_address.message}</p>
            )}
          <Input
            label="Apartment, suite, etc."
            {...register("billing_address.address_2", { required: "Address is required" 
          })}
            defaultValue={address2}
            touched={touchedFields}
            errors={errors}
            required
          />
          {errors.billing_address?.message && (
              <p className="text-red-500">{errors.billing_address.message}</p>
            )}
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              {...register("billing_address.postal_code", { 
                required: "Postal Code is required", 
                pattern: { value: /^\d{6}$/, message: "Postal code must be 6 digits" } 
               })}
               onChange={(e) => {
                setValue("billing_address.postal_code", e.target.value);
                trigger("billing_address.postal_code");
              }}
              defaultValue={postalCode}
              errors={errors}
              touched={touchedFields}
              required
            />
            {errors.billing_address?.message && (
              <p className="text-red-500">{errors.billing_address.message}</p>
            )}
            <Input
              label="City"
              {...register("billing_address.city", { 
                required: "City is required", 
                pattern: { value: /^[a-zA-Z]*$/, message: "City must contain only alphabets" } 
                })}
                onChange={(e) => {
                  setValue("billing_address.city", e.target.value);
                  trigger("billing_address.city");
                }}
                defaultValue={city}
                errors={errors}
              touched={touchedFields}
              required
            />
            {errors.billing_address?.message && (
              <p className="text-red-500">{errors.billing_address.message}</p>
            )}
          </div>
          <Input
            label="State / Province"
            {...register("billing_address.province", { 
              required: "Province is required", 
              pattern: { value: /^[a-zA-Z]*$/, message: "Province must contain only alphabets" } 
              })}
              onChange={(e) => {
                setValue("billing_address.province", e.target.value);
                trigger("billing_address.province");
              }}
            defaultValue={province}
            errors={errors}
            touched={touchedFields}
            required
          />
          <NativeSelect
            {...register("billing_address.country_code", { required: "Country is required" })}
            defaultValue={countryCode}
            required
            errors={errors}
            touched={touchedFields}
          >
            <option value="">-</option>
            {regionOptions.map((option, i) => {
              return (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              )
            })}
          </NativeSelect>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              className="ml-2 w-full small:max-w-[140px]"
              type="submit"
            //  style={{width: '150px', height: '20px'}}
            >
              Save Changes
            </Button>
            <div className="flex items-end justify-between" style={{ display: "flex", alignItems: "end", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  reset({
                    ...mapBillingAddressToFormData({ customer }),
                  })
                  setFocus("billing_address.first_name");
                  setFocus("billing_address.last_name");
                  setFocus("billing_address.address_1");
                  setFocus("billing_address.address_2");
                  setFocus("billing_address.postal_code");
                  setFocus("billing_address.city");
                  setFocus("billing_address.province");
                  // setFocus("billing_address.country_code");
              
                  setValue("billing_address.first_name", customer.first_name, { shouldTouch: true });
  setValue("billing_address.last_name", customer.last_name, { shouldTouch: true });
  setValue("billing_address.address_1", customer.billing_address?.address_1 ?? "", { shouldTouch: true });
  setValue("billing_address.address_2", customer.billing_address?.address_2 ?? "", { shouldTouch: true });
  setValue("billing_address.postal_code", customer.billing_address?.postal_code ?? "", { shouldTouch: true });
  setValue("billing_address.city", customer.billing_address?.city ?? "", { shouldTouch: true });
  setValue("billing_address.province", customer.billing_address?.province ?? "", { shouldTouch: true });
  // setValue("billing_address.country_code", " - ", { shouldTouch: true });

                 }}
                className="ml-2 w-full small:max-w-[140px]"
                type="button"
              //  style={{width: '90px', height: '20px'}}
              >
                Clear
              </Button>
            </div>
          </div>

        </div>
      </AccountInfo>
    </form>
  )
}

const mapBillingAddressToFormData = ({ customer }: MyInformationProps) => {
  return {
    billing_address: {
      first_name: customer.billing_address?.first_name || undefined,
      last_name: customer.billing_address?.last_name || undefined,
      company: customer.billing_address?.company || undefined,
      address_1: customer.billing_address?.address_1 || undefined,
      address_2: customer.billing_address?.address_2 || undefined,
      city: customer.billing_address?.city || undefined,
      province: customer.billing_address?.province || undefined,
      postal_code: customer.billing_address?.postal_code || undefined,
      country_code: customer.billing_address?.country_code || undefined,
    },
  }
}

export default ProfileBillingAddress
