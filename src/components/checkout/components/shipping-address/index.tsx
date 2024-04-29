import { CheckoutFormValues } from "@/lib/context/checkout-context"
import ConnectForm from "@/components/common/components/connect-form"
import Input from "@/components/common/components/input"
import { useMeCustomer } from "medusa-react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import { emailPattern, phonePattern, namePattern,lastNamePattern, phoneNumberPattern } from "@/lib/util/regex"
import { Button } from "@medusajs/ui"
import { useEffect } from "react"
import { useForm } from "react-hook-form";


type ShippingAddressProps = {
  checked: boolean;
  onChange: () => void;  // Adjust this function signature if the actual onChange does something else
};

const ShippingAddress: React.FC<ShippingAddressProps> = ({ checked, onChange }) => {
  const { customer } = useMeCustomer();
  const { register, setValue, setFocus, reset, trigger, formState: { errors, touchedFields }, watch } = useForm({});

// Watch the value of the "shipping_address.first_name" field
const firstNameValue = watch("shipping_address.first_name");

  useEffect(() => {

    setFocus("email");
    setFocus("shipping_address.first_name");
    setFocus("shipping_address.last_name");
    setFocus("shipping_address.address_1");
    setFocus("shipping_address.address_2");
    setFocus("shipping_address.postal_code");
    setFocus("shipping_address.city");
    setFocus("shipping_address.country_code");
    setFocus("shipping_address.province");
    setFocus("shipping_address.phone");
   

    setValue("email", "", { shouldTouch: true });
    setValue("shipping_address.first_name", "", { shouldTouch: true });
    setValue("shipping_address.last_name", "", { shouldTouch: true });
    setValue("shipping_address.address_1", "", { shouldTouch: true });
    setValue("shipping_address.address_2", "", { shouldTouch: true });
    setValue("shipping_address.postal_code", "", { shouldTouch: true });
    setValue("shipping_address.city", "", { shouldTouch: true });
    setValue("shipping_address.country_code", "", { shouldTouch: true });
    setValue("shipping_address.province", "", { shouldTouch: true });
    setValue("shipping_address.phone", "", { shouldTouch: true });
   }, [customer, reset, setFocus, setValue]);
   
    // Function to check if the first name field is filled
  const isFirstNamedFilled = () => {
    return firstNameValue && firstNameValue.trim() !== '';
  };

  
  return (
    <div>
      {customer && (customer.shipping_addresses?.length || 0) > 0 && (
        <div className="mb-6 flex flex-col gap-y-4 bg-amber-100 p-4">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect addresses={customer.shipping_addresses} />
        </div>
      )}
     <ConnectForm<CheckoutFormValues>>
        {({ register, formState: { errors, touchedFields }, reset, setFocus, setValue, trigger }) => (
          <div className="grid grid-cols-1 gap-y-2">
              <div className="flex justify-end mt-0">

<Button
    variant="secondary"
    onClick={() => { reset();
      setFocus("email");
      setFocus("shipping_address.first_name");
      setFocus("shipping_address.last_name");
      setFocus("shipping_address.address_1");
      setFocus("shipping_address.address_2");
      setFocus("shipping_address.postal_code");
      setFocus("shipping_address.city");
      setFocus("shipping_address.province");
      setFocus("shipping_address.phone");
      setFocus("shipping_address.country_code");
   
      setValue("email", "", { shouldTouch: true });
      setValue("shipping_address.first_name", "", { shouldTouch: true });
      setValue("shipping_address.last_name", "", { shouldTouch: true });
      setValue("shipping_address.address_1", "", { shouldTouch: true });
      setValue("shipping_address.address_2", "", { shouldTouch: true });
      setValue("shipping_address.postal_code", "", { shouldTouch: true });
      setValue("shipping_address.city", "", { shouldTouch: true });
      setValue("shipping_address.province", "", { shouldTouch: true });
      setValue("shipping_address.phone", "", { shouldTouch: true });
      setValue("shipping_address.country_code", "", { shouldTouch: true });


     }}
    className="ml-2 w-full small:max-w-[140px]"
    type="button"
  //  style={{width: '90px', height: '20px'}}
  >
    Clear
  </Button>  
  </div>
           <Input
              label="Email"
              // id="email"
              className={`custom-input wide-input ${errors.email ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailPattern,
                  message: "Invalid email, please enter a valid email address.",
                },
              })}
              onChange={(e) => {
                setValue("email", e.target.value);
                trigger("email");
              }}
              autoComplete="email"
              errors={errors}
              // touched={touchedFields}
              required
              />
              {errors.email && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.email.message}</p>
   )}

            <div className="grid grid-cols-2 gap-x-2">
            <div className="input-container">
 <Input
  label="First name"
  id="first_name"
  className={`custom-input wide-input ${errors.shipping_address?.first_name && touchedFields.shipping_address?.first_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
 }`}
  {...register("shipping_address.first_name", {
    required: "First name is required" ,
    pattern: {
      value: namePattern,
      message: "First name must contain only alphabetic characters"
    }
  })} 
  onChange={(e) => {
    console.log('e.target.value', e.target.value)
    console.log('shipping_address.first_name',)
    setValue("shipping_address.first_name", e.target.value);
    trigger("shipping_address.first_name");
  }}
  onBlur={(e) => {
    console.log('First name on blur:', e.target.value);
    setValue("shipping_address.first_name", e.target.value);
    trigger("shipping_address.first_name");
  }}
  autoComplete="given-name"
  errors={errors}
  // touched={touchedFields}
  required
 />
 <div className="error-message">
  {errors.shipping_address?.first_name && (
    <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.first_name.message}</p>
  )}
 </div>
</div>

             <div className="input-container">
 <Input
   label="Last name"
   id="last_name"
   className={`custom-input wide-input ${errors.shipping_address?.last_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
 }`}
   {...register("shipping_address.last_name", {
     required: "Last name is required" ,
     pattern: {
       value: lastNamePattern,
       message: "Last name must contain only alphabetic characters"
     }
   })}
   onChange={(e) => {
    setValue("shipping_address.last_name", e.target.value);
    trigger("shipping_address.last_name");
  }}
  onBlur={(e) => {
    console.log('Last name on blur:', e.target.value);
    setValue("shipping_address.last_name", e.target.value);
    trigger("shipping_address.last_name");
  }}
   autoComplete="family-name"
   errors={errors}
  //  touched={touchedFields}
   required
 />
 <div className="error-message">
   {errors.shipping_address?.last_name && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.last_name.message}</p>
   )}
 </div>
</div>


            </div>
     
            <Input
              label="Address"
              className={`custom-input wide-input ${errors.shipping_address?.address_1 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
            }`}
              {...register("shipping_address.address_1", {
                required: "Address is required",
              })}
              autoComplete="address-line1"
              errors={errors}
              onBlur={(e) => {
                console.log('First name on blur:', e.target.value);
                setValue("shipping_address.address_1", e.target.value);
                trigger("shipping_address.address_1");
              }}
              // touched={touchedFields}
              required
            />
            {errors.shipping_address?.address_1 && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.address_1.message}</p>
   )}
            <Input
              label="Apartments, suite, etc."
              className={`custom-input wide-input ${errors.shipping_address?.address_2 ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
            }`}
              {...register("shipping_address.address_2", {
                required: "Address is required",
              })}
              autoComplete="address-line2"
              errors={errors}
              onBlur={(e) => {
                console.log('First name on blur:', e.target.value);
                setValue("shipping_address.address_2", e.target.value);
                trigger("shipping_address.address_2");
              }}
              // touched={touchedFields}
              required
            />
            {errors.shipping_address?.address_2 && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.address_2.message}</p>
   )}
            <div className="grid grid-cols-[122px_1fr] gap-x-2">
            <div className="input-container">
 <Input
 label="Postal code"
 className={`custom-input wide-input ${errors.shipping_address?.postal_code ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
 }`}
 {...register("shipping_address.postal_code", {
   required: "Postal Code is required", 
   pattern: { value: /^\d{6}$/, message: "Postal code must be 6 digits" } 
  })}
  onChange={(e) => {
    setValue("shipping_address.postal_code", e.target.value);
    trigger("shipping_address.postal_code");
  }}
  onBlur={(e) => {
    console.log('First name on blur:', e.target.value);
    setValue("shipping_address.postal_code", e.target.value);
    trigger("shipping_address.postal_code");
  }}
 autoComplete="postal-code"
 errors={errors}
//  touched={touchedFields}
 required
 />
 <div className="error-message">
 {errors.shipping_address?.postal_code && (
   <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.postal_code.message}</p>
 )}
 </div>
</div>

<div className="input-container">
 <Input
 label="City"
 className={`custom-input wide-input ${errors.shipping_address?.city ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
 }`}
 {...register("shipping_address.city", {
   required: "City is required", 
   pattern: { value: /^[a-zA-Z]*$/, message: "City must contain only alphabets" } 
   })}
   onChange={(e) => {
    setValue("shipping_address.city", e.target.value);
    trigger("shipping_address.city");
  }}
  onBlur={(e) => {
    console.log('First name on blur:', e.target.value);
    setValue("shipping_address.city", e.target.value);
    trigger("shipping_address.city");
  }}
 autoComplete="address-level2"
 errors={errors}
//  touched={touchedFields}
 required
 />
 <div className="error-message">
 {errors.shipping_address?.city && (
   <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.city.message}</p>
 )}
 </div>
</div>

            </div>
            <CountrySelect
            className={`custom-input wide-input ${errors.shipping_address?.country_code ? 'error-border  ' : ""
          }`}
              {...register("shipping_address.country_code", {
                required: "Country is required",
              })}
              autoComplete="country"
              errors={errors}
              onBlur={(e) => {
                console.log('First name on blur:', e.target.value);
                setValue("shipping_address.country_code", e.target.value);
                trigger("shipping_address.country_code");
              }}
              // touched={touchedFields}
              required
            />
            {errors.shipping_address?.country_code && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.country_code.message}</p>
   )}
            <Input
              label="State / Province"
              className={`custom-input wide-input ${errors.shipping_address?.province ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
            }`}
              {...register("shipping_address.province", {
                required: "Province is required", 
                pattern: { value: /^[a-zA-Z]*$/, message: "Province must contain only alphabets" } 
                })}
                onChange={(e) => {
                  setValue("shipping_address.province", e.target.value);
                  trigger("shipping_address.province");
                }}
                onBlur={(e) => {
                  console.log('First name on blur:', e.target.value);
                  setValue("shipping_address.province", e.target.value);
                  trigger("shipping_address.province");
                }}
              autoComplete="address-level1"
              errors={errors}
              // touched={touchedFields}
              required
            />
             {errors.shipping_address?.province && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.province.message}</p>
   )}
            <Input
              label="Phone"
              className={`custom-input wide-input ${errors.shipping_address?.phone ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
            }`}
              {...register("shipping_address.phone", {
                required: "Phone number is required",
                pattern: {
                  value: phoneNumberPattern,
                  message: "Invalid phone number, please enter a valid Indian phone number.",
                },
              })}
              onChange={(e) => {
                setValue("shipping_address.phone", e.target.value);
                trigger("shipping_address.phone");
              }}
              onBlur={(e) => {
                console.log('First name on blur:', e.target.value);
                setValue("shipping_address.phone", e.target.value);
                trigger("shipping_address.phone");
              }}
              autoComplete="tel"
              errors={errors}
              // touched={touchedFields}
              required
              />
              {errors.shipping_address?.phone && (
     <p className="-mt-1 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.shipping_address.phone.message}</p>
   )}
     
              </div>
              
        )}
       
        {/* <button>Clear</button> */}
          {/* <Button variant="secondary" type="button" onClick={() => reset} className="flex-grow" style={{ flexBasis: '25%' }}>Clear</Button> */}
      </ConnectForm>
      <style>
        {`
        
        .custom-input {
          // font-size: 1rem;
          // padding-top: 25px !important;
          // padding: 0px 0px !important;
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
        input:-webkit-autofill, input:-webkit-autofill:focus {
          box-shadow: 0 0 0 1000px white inset;
          -webkit-text-fill-color: #333;
        }
         `}
      </style>
      
    </div>
  )
}

export default ShippingAddress
