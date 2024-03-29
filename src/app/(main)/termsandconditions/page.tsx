import { Metadata } from "next"
import TermsandConditionsTemplate from "@modules/termsandconditions/templates"


export const metadata: Metadata = {
  title: "TermsandConditions",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <TermsandConditionsTemplate />
}
