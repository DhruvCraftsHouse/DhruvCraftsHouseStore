import { Metadata } from "next"
import CustomerServiceTemplate from "@modules/customer-service/templates"


export const metadata: Metadata = {
  title: "Certification",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <CustomerServiceTemplate />
}
