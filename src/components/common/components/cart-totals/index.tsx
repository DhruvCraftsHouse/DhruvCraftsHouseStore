import { Cart, Order } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import { InformationCircleSolid } from "@medusajs/icons"
import { formatAmount } from "medusa-react"
import React from "react"
import Medusa from "@medusajs/medusa-js";


type CartTotalsProps = {
  data: Omit<Cart, "refundable_amount" | "refunded_total"> | Order
}
const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
 });
const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
  // console.log("data cart ",data)


  // console.log("original cart summary cart ",data.items[0].variant.)
  const sum = data.items.reduce((total, item) => {
    // Check if item.total is defined
    if (item.total) {
      return total + item.total
    }
    return total;
   }, 0);
   
   
  //  console.log("sum",sum);
   let originalSum = data.items.reduce((total, item) => {
    // console.log("product id ",item.variant)

    // console.log("percentage ",item.variant.product.buy_get_offer)
    // const percentage = item.variant.product.buy_get_offer;
    // Check if item.original_total is defined
    if (item.original_total) {
      // if(percentage)
      // {
        // console.log("total ",item.original_total * (100 + percentage)/100)
        return total + item.original_total 
      // }
      
    }
    return total;
   }, 0);
   
   if(data.total)
   {
    if(originalSum < data.total)
    {
     originalSum = data.total
    }
   }
  


  const {
    subtotal,
    discount_total,
    gift_card_total,
    tax_total,
    shipping_total,
    total,
  } = data

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: data.region,
      includeTaxes: false,
    })
  }

  let subtotalCal = sum;

  if(sum && subtotalCal){
    if(tax_total)
    {
      // console.log("tax_total ",tax_total)

      subtotalCal = subtotalCal-tax_total;
    }
   
    if(shipping_total)
    {
      // console.log("shipping_total ",shipping_total)
      subtotalCal = subtotalCal-shipping_total;
    }
    
  }


 
  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
      {/* <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Original Total without Offer
          </span>
          <span>{getAmount(originalSum)}</span>
        </div> */}
        <div className="flex items-center justify-between">
          <span className="flex gap-x-1 items-center">
            Subtotal
            <Tooltip content="Cart total excluding shipping and taxes.">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip>
          </span>
          <span>{getAmount(subtotalCal)}</span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="text-ui-fg-interactive">
              - {getAmount(discount_total)}
            </span>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span className="text-ui-fg-interactive">
              - {getAmount(gift_card_total)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>{getAmount(shipping_total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span>{getAmount(tax_total)}</span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>Total</span>
        <span className="txt-xlarge-plus">{getAmount(sum)}</span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
