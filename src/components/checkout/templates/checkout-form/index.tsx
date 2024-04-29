"use client"

import Addresses from "@/components/checkout/components/addresses"
import Payment from "@/components/checkout/components/payment"
import Review from "@/components/checkout/components/review"
import Shipping from "@/components/checkout/components/shipping"
import { useCart } from "medusa-react"

const CheckoutForm = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses />
        </div>

        <div>
          <Shipping cart={cart} />
        </div>

        <div>
          <Payment />
        </div>

        <div>
          <Review />
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
