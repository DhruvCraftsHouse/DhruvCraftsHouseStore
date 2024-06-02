import { useCheckout } from "@/lib/context/checkout-context"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import { CheckCircleSolid } from "@medusajs/icons"
import Spinner from "@/components/common/icons/spinner"
import Divider from "@/components/common/components/divider"
import { useForm } from "react-hook-form"
import { RadioGroup } from "@headlessui/react"
import Radio from "@/components/common/components/radio"
import { ErrorMessage } from "@hookform/error-message"
import {  useCart, useCartShippingOptions } from "medusa-react"
import { formatAmount } from "@/lib/util/prices"
import { useEffect, useMemo, useState } from "react"
import { Cart } from "@medusajs/medusa"
import axios from 'axios';
import Medusa from "@medusajs/medusa-js"
import { useUpdateCart } from "medusa-react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { MEDUSA_BACKEND_URL } from "@/lib/config"



const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });


type ShippingOption = {
  value?: string
  label?: string
  price: string
}

type ShippingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

interface CustomShippingOption {
  name: string;
  amount: number;
  id: string;
  // Add other fields if necessary
}

// Define the type of option
type OptionType = {
  value: string;
  label: string;
 };

const Shipping: React.FC<ShippingProps> = ({ cart }) => {
  const {
    editAddresses: { state: isAddressesOpen, close: closeAddresses },
    editShipping: { state: isOpen, open, close },
    editPayment: {
      state: isPaymentOpen,
      open: openPayment,
      close: closePayment,
    },
    addressReady,
    shippingReady,
  } = useCheckout()
 
  const [firstShippingOptionId, setFirstShippingOptionId] = useState<string>('');
  const [shippingOptionsFromApi, setShippingOptionsFromApi] = useState([]);

  // Modify fetchShippingOptions to update firstShippingOptionId if not already set
  const fetchShippingOptions = async () => {
    console.log("inside fetchShippingOptions async!!!");

    try {
      console.log('try',MEDUSA_BACKEND_URL)

      console.log("shipping options ",shipping_options)
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/shippingOptions`);
      console.log('response', response)
      setShippingOptionsFromApi(response.data.shipping_options);
      console.log('response.data.shipping_options', response.data.shipping_options)
      // Check if firstShippingOptionId is not already set from useCartShippingOptions
      if (!firstShippingOptionId && response.data.shipping_options.length > 0) {
        // Set the first shipping option id from the API response
        setFirstShippingOptionId(response.data.shipping_options[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch shipping options:', error);
    }
  };

  useEffect(() => {
    console.log("inside fetchShippingOptions");
    fetchShippingOptions();
  }, []); // Dependency array remains empty to ensure this effect runs once on component mount

  // const currentShippingOption = cart.shipping_methods?.[0]?.shipping_option.id || ""

  // const [shippingOptionId, setShippingOptionId] = useState(currentShippingOption)

  const currentShippingOption = cart.shipping_methods?.[0]?.shipping_option.id || "";
const [shippingOptionId, setShippingOptionId] = useState<string>(currentShippingOption);


  const { addShippingMethod, setCart } = useCart()

  const {
    setError,
    formState: { errors },
  } = useForm()

  // Fetch shipping options
  const { shipping_options, refetch } = useCartShippingOptions(cart.id, {
    enabled: !!cart.id,
  })
  const [customShippingOptions, setCustomShippingOptions] = useState([]);

  // Any time the cart changes we need to ensure that we are displaying valid shipping options
  useEffect(() => {
    const refetchShipping = async () => {
      await refetch()
    }

    refetchShipping()
  }, [cart, refetch])

  

  const submitShippingOption = async (soId: string, label: string, price: number, firstShippingOptionId: string) => {
    
    console.log("shipping options on submitShippingOption ",shipping_options)

    // console.log("clicked submit shipping");
    console.log('Submitting Shipping Option ID:', soId); // Log the ID being submitted
    // console.log('Submitting Shipping LABEL:', label); // Log the label being submitted
    // console.log('Submitting Shipping PRICE:', price); // Log the price being submitted

    console.log('firstShippingOptionId', firstShippingOptionId)
    soId = firstShippingOptionId;
    if(!firstShippingOptionId && shipping_options && shipping_options?.length >0 )
      {
        console.log("no firstshipping optionb", shipping_options[0].id);
        soId = String(shipping_options[0].id); // Explicitly converting to String
      }
    console.log('soId', soId)
    price = price * 100 ;
  
    try {
      // Send a POST request to update the cart
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/updateCart`, {
        id: soId,
        amount: price,
        name: label
      });
  
      // Assuming the response contains the updated cart
      // console.log('Cart updated successfully', response.data);
  
      // Update the cart in the frontend
      addShippingMethod.mutate(
        { option_id: soId },
        {
          onSuccess: ({ cart }) => {
            setCart(cart);
            close();
            openPayment();
          },
          onError: (error) => {
            console.error("Error adding shipping method:", error);
            // setError("soId", {
            //   type: "validate",
            //   message: "An error occurred while adding shipping. Please try again.",
            // }, { shouldFocus: true });
          },
        }
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      setError("soId", {
        type: "validate",
        message: "An error occurred while updating the cart. Please try again.",
      }, { shouldFocus: true });
    }
  }
  
  useEffect(() => {
    // Cleanup function
    return () => {
      toast.dismiss();
    };
  }, []);
  
  const handleChange = (value: string) => {
    setShippingOptionId(value)
  }

  const handleEdit = () => {
    open()
    closeAddresses()
    closePayment()
  }

  const editingOtherSteps = isAddressesOpen || isPaymentOpen

  // Memoized shipping method options
  const shippingMethods: ShippingOption[] = useMemo(() => {
    if (shipping_options && cart?.region) {
      return shipping_options?.map((option) => ({
        value: option.id,
        label: option.name,
        price: formatAmount({
          amount: option.amount || 0,
          region: cart.region,
        }),
      }))
    }

    return []
  }, [shipping_options, cart])

  console.log("shipping methods ",shippingMethods)
  console.log("shipping options ",shipping_options)

 
  
 
// console.log("cart.shipping_address?.postal_code ",cart.shipping_address?.postal_code)
// Function to fetch custom shipping options
useEffect(() => {
  const fetchCustomShippingOptions = async () => {
    try {
      const response = await axios.post(`${MEDUSA_BACKEND_URL}/store/shiprocket-rate-calculation`, {
        pickup_postcode: 641001,
        delivery_postcode: cart.shipping_address?.postal_code,
        weight: 0.2,
        declared_value: 50,
      });

      console.log("Shiprocket", response.data.courierDetails);
      const transformedCustomOptions = response.data.courierDetails.map((option: CustomShippingOption) => ({
        label: option.name,
        price: `₹${option.amount.toFixed(2)}`, // Format the amount, adjust as needed
        value: option.id.toString(), // Convert ID to string
      }));

      setCustomShippingOptions(transformedCustomOptions);
      // console.log("transformedCustomOptions ",transformedCustomOptions)

    
      
    } catch (error) {
      console.error("Error fetching custom shipping options:", error);
    }
  };

  if (cart.shipping_address?.postal_code) {
    fetchCustomShippingOptions();
  }
}, [cart.shipping_address?.postal_code]);

// console.log("customShippingOptions ",customShippingOptions)

 
// Combine existing and custom shipping methods
const combinedShippingMethods: ShippingOption[] = useMemo(() => {
  return [ ...customShippingOptions];
}, [ customShippingOptions]);

// console.log("shipping options" , shipping_options)
// console.log("shipping method" , shippingMethods)
// console.log("combinedShippingMethods " , combinedShippingMethods)

// console.log("cart shipping  " , cart)
// console.log("cart shipping pincode  " , cart.shipping_address?.postal_code)

// Define selectedShippingOption here, using combinedShippingMethods and shippingOptionId
// const selectedShippingOption = combinedShippingMethods.find(option => option.value === shippingOptionId);
const selectedShippingOption = shippingOptionId  ? combinedShippingMethods.find(option => option.value === shippingOptionId)  : undefined;


// Log errors to the console whenever they change
useEffect(() => {
  console.log('Form errors:', errors);
}, [errors]);

// console.log(' cart.shipping_methods[0].price',  cart.shipping_methods[0].price)
  return (
    <div className="bg-white p-4 small:px-8">
            <ToastContainer />

      <div className="flex flex-row items-center justify-between mb-6">

        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                editingOtherSteps && !shippingReady,
            }
          )}
        >
          Delivery
          {!isOpen && currentShippingOption && shippingReady && (
            <CheckCircleSolid />
          )}
        </Heading>
        {!isOpen && addressReady && (
          <Text>
            <button onClick={handleEdit} className="text-ui-fg-interactive">
              Edit
            </button>
          </Text>
        )}
      </div>
      {!editingOtherSteps && isOpen ? (
        <div className="pb-8">
          <div>
            <RadioGroup
              value={shippingOptionId}
              onChange={(value: string) => handleChange(value)}
            >
               {combinedShippingMethods && combinedShippingMethods.length ? (
                combinedShippingMethods.map((option) => {
                  return (
                    <RadioGroup.Option
                      key={option.value}
                      value={option.value}
                      className={clx(
                        "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                        {
                          "border-ui-border-interactive":
                            option.value === shippingOptionId,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <Radio checked={shippingOptionId === option.value} />
                        <span className="text-base-regular">
                          {option.label}
                        </span>
                      </div>
                      <span className="justify-self-end text-gray-700">
                        {option.price}
                      </span>
                    </RadioGroup.Option>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-gray-900">
                  <Spinner />
                </div>
              )}
            </RadioGroup>
            <ErrorMessage
              errors={errors}
              name="soId"
              render={({ message }) => {
                return (
                  <div className="pt-2 text-rose-500 text-small-regular">
                    <span>{message}</span>
                  </div>
                )
              }}
            />
          </div>

          <Button
  size="large"
  className="mt-6"
  onClick={() => {
    if (selectedShippingOption) {
      const label = selectedShippingOption.label || ""; // Fallback to empty string if label is undefined
      const price = selectedShippingOption.price ? parseFloat(selectedShippingOption.price.replace(/[^\d.]/g, '')) : 0; // Fallback to 0 if price is undefined
      submitShippingOption(shippingOptionId, label, price, firstShippingOptionId);
    }
    else{
      // console.log("not selectedShippingOption")
      toast.error('Please select one of the shipping providers');
      return;
    }
  }}
>
  Continue to payment
</Button>


        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && shippingReady && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods[0].shipping_option.name} (
                  {formatAmount({
                    amount: cart.shipping_methods[0].price,
                    region: cart.region,
                  })
                    .replace(/,/g, "")
                    .replace(/\./g, ".")}
                  )
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
