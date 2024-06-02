"use client";

import useEnrichedLineItems from "@/lib/hooks/use-enrich-line-items";
import SkeletonCartPage from "@/components/skeletons/templates/skeleton-cart-page";
import { useCart, useMeCustomer } from "medusa-react";
import EmptyCartMessage from "../components/empty-cart-message";
import SignInPrompt from "../components/sign-in-prompt";
import ItemsTemplate from "./items";
import Summary from "./summary";
import Divider from "@/components/common/components/divider";
//additional imports for our customizated cart page display
import { getDiscountList } from "./productDiscount";
import React, { useEffect, useState, useMemo } from 'react';

const CartTemplate = () => {
  const { cart } = useCart();
  const { customer, isLoading } = useMeCustomer();
  const items = useEnrichedLineItems();

  // Memoize productIds to avoid unnecessary re-renders
  const productIds = useMemo(() => {
    const ids = new Set<string>();
    if (items) {
      items.forEach((item) => {
        if (item.variant && item.variant.product_id) {
          ids.add(item.variant.product_id);
        }
      });
    }
    return Array.from(ids);
  }, [items]);

  // State variable to store discounts
  const [discounts, setDiscounts] = useState<any[] | null>(null);

  // Function to fetch and set the discounts array
  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = [];
      for (const productId of productIds) {
        const discountsResponse = await getDiscountList(productId);
        fetchedDiscounts.push(discountsResponse);
      }
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      console.error("Error fetching discounts: ", error);
      setDiscounts([]); // Set an empty array in case of an error
    }
  };

  // Call the fetchDiscounts function when the component mounts or productIds change
  useEffect(() => {
    if (productIds.length > 0) {
      fetchDiscounts();
    }
  }, [productIds]); // Add productIds as a dependency to re-fetch discounts if productIds change

  if (!cart || !cart?.id?.length || isLoading) {
    return <SkeletonCartPage />;
  }

  return (
    <div className="py-12">
      <div className="content-container">
        {cart.items.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white p-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}

              {/* Display Discounts if they exist */}
              {customer && discounts && discounts.length > 0 && (
                <div>
                  {discounts
                    .filter(discount => discount != null) // Filter out null or undefined elements
                    .map((discount, index) => (
                      <div key={index}>
                        <p style={{ fontSize: "14px", color: "#D7373D" }}>
                          Use code <span style={{ fontWeight: 600 }}>{discount.code}</span> for Extra <span style={{ fontWeight: 600 }}>{discount.value}{discount.type}</span> off for <span style={{ fontWeight: 600 }}>{discount.title}</span>
                        </p>
                      </div>
                    ))}
                </div>
              )}
              <ItemsTemplate region={cart?.region} items={items} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white p-6">
                      <Summary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTemplate;
