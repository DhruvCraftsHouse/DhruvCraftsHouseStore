import { Metadata } from "next"
import WishlistTemplate from "@/components/wishlist/templates"


export const metadata: Metadata = {
  title: "Wishlist",
  description: "Explore all of our products.",
}

export default function WishlistPage() {
  return <WishlistTemplate />
}
