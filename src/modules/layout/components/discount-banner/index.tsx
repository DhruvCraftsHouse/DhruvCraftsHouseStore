import React, { useState, useEffect } from "react";
import axios from "axios";
import { Discount } from "@medusajs/medusa";
import "./DiscountBanner.css";
import { useMeCustomer } from "medusa-react";
import Medusa from "@medusajs/medusa-js";
import { getDiscountList } from './customerDiscount';
import { MEDUSA_BACKEND_URL } from "@lib/config";

// Initializing the Medusa client
const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

interface ApiResponse {
  discounts: Discount[];
  // Other properties from your API response if any
}

const getCurrencySymbol = (currencyCode: string) => {
  const currencySymbols: Record<string, string> = {
    usd: "$",
    eur: "€",
    gbp: "£",
    inr: "₹", // Add INR and its symbol
    // Add more currency codes and symbols as needed
  };

  // Use type assertion to specify that currencyCode is a valid key
  return currencySymbols[currencyCode as keyof typeof currencySymbols] || currencyCode;
};

// ...

const DiscountBanner = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);

  // const [customerId, setCustomerId ] = useState('');

  // const [isVipCustomer, setIsVipCustomer] = useState(false);

  const { customer} = useMeCustomer();
 
  // Inside discunt banner component
// useEffect(() => {
//   if (!customer) {
//     // console.log('No customer data, redirecting to login');
//   } else {
//     medusa.auth.getSession()
//       .then(({ customer }) => {
//         // console.log("Customer is authenticated", customer);
//         // fetchDiscount()
//         setCustomerId(customer.id)
//         // Proceed with your logic here
//       })
//       .catch(error => {
//         console.error("Error during session retrieval: ", error);
//       });
//   }
// }, [customer]);

// const fetchVipStatus = async () => {
//   if (customer) {
//     try {
//       // Construct the URL with query parameters
//       const response = await getDiscountList();
//       const vipCustomerUrl = `${MEDUSA_BACKEND_URL}/store/vipCustomer?customer_id=${customer.id}&group_id=${response.data.customer_groups[0].id}`;

//       // Make the request to check if the customer is a VIP customer
//       const boolResponse = await axios.get(vipCustomerUrl);
//       setIsVipCustomer(boolResponse.data.found); // Update the state variable
//     } catch (error) {
//       console.error("Error fetching VIP status:", error);
//     }
//   }
// };

// useEffect(() => {
//   fetchVipStatus();
// }, [customer]); // Listen for changes in the customer object

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get("${MEDUSA_BACKEND_URL}/store/discountlist");
      console.log('response discountlist', response.data)
      if (response.status === 200) {
        // If the request is successful, set the API data in state
        // console.log('response.data', response.data)

    
      const currentDate = new Date();

        // console.log('currentDate', currentDate)

        const currentDiscounts = response.data.discounts.filter((discount: Discount) => 
 !discount.ends_at || new Date(discount.ends_at) > currentDate
);

// console.log('currentDiscounts', currentDiscounts)

const activeDiscounts = currentDiscounts.filter((discount:Discount) => !discount.is_disabled);
// console.log('activeDiscounts nav', activeDiscounts)

     // Filter out discounts based on the specified condition
     const filteredDiscounts = activeDiscounts.filter((discount: Discount) => {
      const conditions = discount.rule.conditions;
      // Check if there is only one condition and if its type is 'customer_groups'
      return !(conditions.length === 1 && conditions[0].type === "customer_groups");
    });

      // Update the state with the filtered discounts
      setApiData({ discounts: filteredDiscounts });
      } else {
        // Handle errors here if needed
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      // Handle network or other errors here
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);



  // Function to format the date in the desired format
  const formatDate = (date: Date) => {
    const currentDate = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    // Check if the year is the same as the current year
    if (date.getFullYear() === currentDate.getFullYear()) {
      return `${day}${getDaySuffix(day)} of ${month}`;
    } else {
      const year = date.getFullYear();
      return `${day}${getDaySuffix(day)} of ${month} ${year}`;
    }
  };

  // Function to get the suffix for the day (e.g., 1st, 2nd, 3rd, 4th)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const renderDiscounts = () => {
    if (apiData && apiData.discounts) {
      const currentDate = new Date();
      const currentDiscounts = apiData.discounts.filter(
        (discount) => !discount.ends_at || new Date(discount.ends_at) > currentDate
      );
      const activeDiscounts = currentDiscounts.filter((discount) => !discount.is_disabled);
  
      if (activeDiscounts.length === 0) {
        return null;
      }
  
      const currentDiscount = activeDiscounts[currentDiscountIndex];
  
      if (!currentDiscount || !currentDiscount.regions || currentDiscount.regions.length === 0) {
        return null; // Check if currentDiscount or regions array is undefined or empty
      }
  
      const region = currentDiscount.regions[0]; // Assuming regions array is not empty
      const isFreeShipping = currentDiscount.rule.type === "free_shipping";
      const hasProductConditions = currentDiscount.rule.conditions.some((condition) => condition.type === "products");
  
      let discountMessage = "";
  
      if (hasProductConditions) {
        if (isFreeShipping) {
          discountMessage = `For Free Shipping Charges use CODE ${currentDiscount.code} for special products`;
        } else {
          discountMessage = `Use CODE ${currentDiscount.code} for ${
            currentDiscount.rule.type === "fixed"
              ? `${getCurrencySymbol(region.currency_code)}${currentDiscount.rule.value / 100}/-`
              : `${currentDiscount.rule.value}%`
          } OFF for special products`;
        }
      } else {
        if (!isFreeShipping) {
          discountMessage = `Use CODE ${currentDiscount.code} for ${
            currentDiscount.rule.type === "fixed"
              ? `${getCurrencySymbol(region.currency_code)}${currentDiscount.rule.value / 100}/-`
              : `${currentDiscount.rule.value}%`
          } OFF for all products`;
        } else {
          discountMessage = `For Free Shipping Charges use CODE ${currentDiscount.code} for all products`;
        }
      }
  
      return (
        <div key={currentDiscount.id} className={`discount-message ${isFreeShipping ? 'slide-up-animation' : 'slide-in-animation'}`}>
          <p style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "0.08em", fontFamily: "Klein, sans-serif" }}>
            <span style={{ textDecoration: "underline" }}>{discountMessage}</span>
            {currentDiscount.ends_at && (
              <span className="validity-message"> - <span style={{ textDecoration: "underline" }}>Valid only till {formatDate(new Date(currentDiscount.ends_at))}</span></span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // console.log('apiData.discounts', apiData)
  
  // Function to rotate through discounts and show them one at a time
useEffect(() => {
  if (apiData && apiData.discounts.length > 0) {
    let currentIdx = 0; // Initialize the index
    const timer = setInterval(() => {
      // Increment the index
      currentIdx++;

      // Check if we have reached the end of the discounts array
      if (currentIdx >= apiData.discounts.length) {
        currentIdx = 0; // Reset the index to start from the beginning
      }

      // Update the current discount index
      setCurrentDiscountIndex(currentIdx);
    }, 3000); // Change discount every 3 seconds

    return () => clearInterval(timer);
  }
}, [apiData]);

  return (
    <div className="h-full z-50">
      {apiData ? (
        // Render the discounts if available
        <div className="discount-container" style={{ textAlign: "center" }}>
          {renderDiscounts()}
        </div>
      ) : (
        // Render a loading message while fetching data
        <h1>DISCOUNTS NO</h1>
      )}
    </div>
  );
};

export default DiscountBanner;
