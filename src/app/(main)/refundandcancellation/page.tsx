import { Metadata } from "next"
import RefundandCancellationTemplate from "@modules/refundandcancellation/templates"


export const metadata: Metadata = {
  title: "RefundandCancellation",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <RefundandCancellationTemplate />
}
