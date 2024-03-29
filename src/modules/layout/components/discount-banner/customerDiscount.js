// Import axios, a promise-based HTTP client, for making HTTP requests
import axios from 'axios';
import { MEDUSA_BACKEND_URL } from "@lib/config";


// Define an asynchronous function to get the discount list
export const getDiscountList = async () => {
  try {
    // console.log('inside getDiscountList');
    
    // Making a GET request using axios to fetch the discount list
    const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/discountlist`);

    // Extract the discounts array from the response data
    const discountsArray = response.data.discounts;

    // console.log('discountsArray:', discountsArray);

    // Filter discounts based on the conditions
    const filteredDiscounts = discountsArray.filter((discount) => {
      // Check if the discount has a 'rule' attribute
      if (discount.rule) {
        // Check if the 'rule' attribute has 'conditions' array with at least one element of 'type' attribute as 'customer_groups'
        if (Array.isArray(discount.rule.conditions) && discount.rule.conditions.some((condition) => condition.type === 'customer_groups')) {
          return true; // Include this discount in the filtered list
        }
      }
      return false; // Exclude this discount
    });

    // Logging the filtered discounts for debugging purposes
    // console.log("Filtered Discounts:", filteredDiscounts);

// Extract discount_id, condition_id, code, ends_at, value, and type from each filtered discount
// ...

// Extract discount_id, condition_id, code, ends_at, value, and type from each filtered discount
const discountInfo = filteredDiscounts.map((discount) => {
    const discount_id = discount.id;
    const condition_id = discount.rule.conditions.find((condition) => condition.type === 'customer_groups').id;
    const code = discount.code;
    const ends_at = discount.ends_at;
    const value = discount.rule.value; // Extract 'value' from the 'rule' object
    let type = discount.rule.type; // Extract 'type' from the 'rule' object
  
    // Check if the type is "percentage" and set it to "%"
    if (type.toLowerCase() === 'percentage') {
      type = '%';
    }
  
    return { discount_id, condition_id, code, ends_at, value, type };
  });
  
  // ...
  
  

    // Logging the extracted discount information
    console.log("Discount Information:", discountInfo);

// Call the productDiscount API for each discountInfo
for (const info of discountInfo) {
    const { discount_id, condition_id, code, ends_at, value, type } = info;
    const apiURL = `${MEDUSA_BACKEND_URL}/store/customerDiscount?discount_id=${discount_id}&conditionId=${condition_id}`;
  
    // Making GET request to the productDiscount API
    const customerDiscountResponse = await axios.get(apiURL);
  
    // Logging the response data
    console.log(`Response for discount_id=${discount_id}, condition_id=${condition_id}: customer groups`, customerDiscountResponse.data);
  
    return customerDiscountResponse;
    // Check if productId matches with the id attribute of any product in productDiscountResponse
    // const matchingProduct = productDiscountResponse.data.products.find((product) => product.id === productId);
  
    // // If a matching product is found, log the product.id and productId
    // if (matchingProduct) {
    // //   console.log(`Matching product found for discount_id=${discount_id}, condition_id=${condition_id}:`);
    // //   console.log("product.id:", matchingProduct.id);
    // //   console.log("productId:", productId);

    // //   // Print code, ends_at, value, and type attributes' values of matchingProduct
    // //   console.log("code:", code);
    // //   console.log("ends_at:", ends_at);
    // //   console.log("value:", value);
    // //   console.log("type:", type);

    //   // Return info as response
    //   return info;
    // } else {
    //   console.log(`No matching product found for discount_id=${discount_id}, condition_id=${condition_id}`);
    // }
}

// Return null if no matching product is found
return null;

   
    // Return the extracted information
    return discountInfo;
  } catch (error) {
    // Logging any errors that occur during the axios request
    console.error("Error:", error);
  }
};
