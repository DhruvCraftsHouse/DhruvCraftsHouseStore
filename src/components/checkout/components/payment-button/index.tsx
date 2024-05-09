import { useCheckout } from "@/lib/context/checkout-context"
import { PaymentSession } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "medusa-react"
import React, { useEffect, useState } from "react"

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const { cart } = useCart()

  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    cart.shipping_methods.length < 1
      ? true
      : false

  switch (paymentSession?.provider_id) {
    // case "stripe":
    //   return (
    //     <StripePaymentButton session={paymentSession} notReady={notReady} />
    //   )
    case "manual":
      return <ManualTestPaymentButton notReady={notReady} />
    // case "paypal":
    //   return (
    //     <PayPalPaymentButton notReady={notReady} session={paymentSession} />
    //   )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}



// const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""



const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)

  const { onPaymentCompleted } = useCheckout()

  const handlePayment = () => {
    console.log("clciked ManualTestPaymentButton handlePayment");
    setSubmitting(true)

    onPaymentCompleted()

    setSubmitting(false)
  }

  return (
    <Button
      disabled={notReady}
      isLoading={submitting}
      onClick={handlePayment}
      size="large"
    >
      Place order
    </Button>
  )
}

export default PaymentButton
