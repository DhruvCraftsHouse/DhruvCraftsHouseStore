import { Metadata } from "next"
import PrivacyPolicyTemplate from "@modules/privacypolicy/templates"


export const metadata: Metadata = {
  title: "TermsandConditions",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <PrivacyPolicyTemplate />
}
