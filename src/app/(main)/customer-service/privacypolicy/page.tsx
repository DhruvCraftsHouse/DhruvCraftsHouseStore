import { Metadata } from "next"
import PrivacyPolicyTemplate from "@modules/customer-service/privacypolicy/templates"


export const metadata: Metadata = {
  title: "PrivacyPolicy",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <PrivacyPolicyTemplate />
}
