import React, { useMemo, useEffect } from "react";
import { medusaClient } from "@/lib/config";
import { Cart, Discount } from "@medusajs/medusa";
import { Button, Label, Tooltip, Text, Heading } from "@medusajs/ui";
import { InformationCircleSolid } from "@medusajs/icons";
import Input from "@/components/common/components/input";
import Trash from "@/components/common/icons/trash";
import { formatAmount, useCart, useUpdateCart } from "medusa-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

type DiscountFormValues = {
  discount_code: string;
};

type DiscountCodeProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const { id, discounts, gift_cards, region } = cart;
  const { mutate, isLoading } = useUpdateCart(id);
  const { setCart } = useCart();

  const { isLoading: mutationLoading, mutate: removeDiscount } = useMutation(
    (payload: { cartId: string; code: string }) => {
      return medusaClient.carts.deleteDiscount(payload.cartId, payload.code);
    }
  );

  const appliedDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return undefined;
    }

    switch (discounts[0].rule.type) {
      case "percentage":
        return `${discounts[0].rule.value}%`;
      case "fixed":
        return `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: region,
        })}`;
      default:
        return "Free shipping";
    }
  }, [cart.items, discounts, region]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DiscountFormValues>({
    mode: "onSubmit",
  });

  const onApply = async (data: DiscountFormValues) => {
    console.log("data", data.discount_code);
  
    try {
      const discountListResponse = await axios.get(
        `${MEDUSA_BACKEND_URL}/store/discountlist`,
        {
          params: {
            discountCode: data.discount_code,
          },
        }
      );
      console.log("Discount list response:", discountListResponse.data);
  
      if (!discountListResponse.data || !discountListResponse.data.discount) {
        console.error("No discount data available");
        if (!discountListResponse.data) {
          // If there is no data in the response, avoid further processing.
          alert("No discount data received from the server");
          return;
        }
        // If discount data is missing but response exists, continue with default eligibility.
        // alert("Discount information is incomplete or missing");
        mutate(
          {
            discounts: [{ code: data.discount_code }],
          },
          {
            onSuccess: ({ cart }) => setCart(cart),
            onError: () => {
              checkGiftCard(data.discount_code);
            },
          }
        );
        return;
      }
  
      const discountData = discountListResponse.data.discount;
      const discountId = discountData.id;
      const conditions = discountData.rule.conditions;
  
      let conditionId = null;
      for (let condition of conditions) {
        if (condition.type === "products") {
          conditionId = condition.id;
          break;
        }
      }
  
      console.log("Discount ID:", discountId);
      console.log("Condition ID for 'products':", conditionId);
  
      let isEligible = true; // Assume eligibility unless checked against specific conditions
  
      // Only fetch products and check eligibility if there is a specific condition ID
      if (conditionId && discountId) {
        const productDiscountResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/productDiscount`, {
          params: {
            discount_id: discountId,
            conditionId: conditionId,
          },
        });
  
        console.log('productDiscountResponse', productDiscountResponse)
        const eligibleProductIds = productDiscountResponse.data.products.map(product => product.id);
        console.log("Eligible Product IDs:", eligibleProductIds);
  
        let matchedItemDetails = null;

        // Check if any cart item is eligible for the discount
        isEligible = cart.items.some(item => eligibleProductIds.includes(item.variant.product.id));

        {isEligible && (
        cart.items.forEach(item => {
          if (eligibleProductIds.includes(item.variant.product.id)) {
           
            isEligible = true;
            matchedItemDetails = {
              productId: item.variant.product.id,
              buy_get_num: item.variant.product.buy_get_num,
              quantity: item.quantity,
              title: item.variant.product.title // assuming title is available under product
            };
            if (item.variant.product.buy_get_num && item.quantity < item.variant.product.buy_get_num) {
              isEligible = false
              alert(`Quantity of ${item.variant.product.title} is not eligible for discount. Requires at least ${item.variant.product.buy_get_num} to apply.`);
              return;
            }
            console.log("Matched Item:", matchedItemDetails);
          }
        })
      )}
      }
  
      if (!isEligible) {
        alert("Discount code not applicable");
        return;
      }
  
      // If eligible, apply the discount
      mutate(
        {
          discounts: [{ code: data.discount_code }],
        },
        {
          onSuccess: ({ cart }) => setCart(cart),
          onError: () => {
            checkGiftCard(data.discount_code);
          },
        }
      );
    } catch (error) {
      console.error("Error fetching discount or product list:", error);
      if (error.response && error.response.data.error === "Discount code, gift card, or product not found") {
        alert("Discount Code is invalid");
      } else {
        console.error("Unexpected error:", error.message || "An error occurred");
      }
    }
  };
  
  

  const checkGiftCard = (code: string) => {
    mutate(
      {
        gift_cards: [
          { code: code },
          ...gift_cards.map((gc) => ({ code: gc.code })),
        ],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () => {
          setError(
            "discount_code",
            {
              message: "Code is invalid",
            },
            {
              shouldFocus: true,
            }
          );
        },
      }
    );
  };

  const removeGiftCard = (code: string) => {
    mutate(
      {
        gift_cards: [...gift_cards]
          .filter((gc) => gc.code !== code)
          .map((gc) => ({ code: gc.code })),
      },
      {
        onSuccess: ({ cart }) => {
          setCart(cart);
        },
      }
    );
  };

  const onRemove = () => {
    removeDiscount(
      { cartId: id, code: discounts[0].code },
      {
        onSuccess: ({ cart }) => {
          setCart(cart);
        },
      }
    );
  };

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="txt-medium">
        {gift_cards.length > 0 && (
          <div className="flex flex-col mb-4">
            <Heading className="txt-medium">Gift card(s) applied:</Heading>
            {gift_cards?.map((gc) => (
              <div
                className="flex items-center justify-between txt-small-plus"
                key={gc.id}
              >
                <Text className="flex gap-x-1 items-baseline">
                  <span>Code: </span>
                  <span className="truncate">{gc.code}</span>
                </Text>
                <Text className="font-semibold">
                  {formatAmount({ region: region, amount: gc.balance })}
                </Text>
                <button
                  className="flex items-center gap-x-2 !background-transparent !border-none"
                  onClick={() => removeGiftCard(gc.code)}
                  disabled={isLoading}
                >
                  <Trash size={14} />
                  <span className="sr-only">Remove gift card from order</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {appliedDiscount ? (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium">Discount applied:</Heading>
              <div className="flex items-center justify-between w-full max-w-full">
                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                  <span>Code:</span>
                  <span className="truncate">{discounts[0].code}</span>
                  <span className="min-w-fit">({appliedDiscount})</span>
                </Text>
                <button
                  className="flex items-center"
                  onClick={onRemove}
                  disabled={isLoading}
                >
                  <Trash size={14} />
                  <span className="sr-only">
                    Remove discount code from order
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onApply)} className="w-full">
            <Label className="flex gap-x-1 mb-2">
              Gift card or discount code?
              <Tooltip content="You can add multiple gift cards, but only one discount code.">
                <InformationCircleSolid color="var(--fg-muted)" />
              </Tooltip>
            </Label>
            <div className="flex w-full gap-x-2 items-center">
              <Input
                label="Please enter code"
                {...register("discount_code", {
                  required: "Code is required",
                })}
                errors={errors}
              />

              <Button
                type="submit"
                variant="secondary"
                className="!min-h-[0] h-10"
                isLoading={isLoading}
              >
                Apply
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DiscountCode;
