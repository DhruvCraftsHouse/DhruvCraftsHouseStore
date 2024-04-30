import { Metadata } from "next"
import StoreTemplate from "@/components/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export default function StorePage() {
  return <StoreTemplate />
}
