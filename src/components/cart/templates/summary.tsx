import { Cart } from "@medusajs/medusa"
import { Button, Heading } from "@medusajs/ui"
import DiscountCode from "@/components/checkout/components/discount-code"
import CartTotals from "@/components/common/components/cart-totals"
import Divider from "@/components/common/components/divider"
import Link from "next/link"
import LoadingSpinner from "@/components/loader"
import { usePathname } from "next/navigation"
import { useState,useEffect } from "react"

type SummaryProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Summary = ({ cart }: SummaryProps) => {
  const route = usePathname()
console.log('route summary', route)

const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  // Initialize clickedPath with the current pathname when the component mounts
  useEffect(() => {
    setClickedPath(route);
  }, [route]);

  useEffect(() => {
    // Determine if navigation is occurring
    setIsNavigating(route !== clickedPath);
  }, [route, clickedPath]);

  // Function to handle link clicks
  const handleLinkClick = (targetPath: string) => {
    // Check if the target path is the same as the current route
    if (targetPath === route) {
      console.log("Already on the same page:", targetPath);
      // Do not proceed with navigation
      return;
    }
  
    console.log("Link clicked with path:", targetPath);
    setClickedPath(targetPath); // Update clickedPath to the target path
    setIsNavigating(true); // Assume navigation is starting
  };
  

  return (
    <div className="flex flex-col gap-y-4">
                  {isNavigating && <LoadingSpinner />}
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals data={cart} />
      <Link href="/checkout"  onClick={() => handleLinkClick('/checkout')}>
        <Button className="w-full h-10">Go to checkout</Button>
      </Link>
    </div>
  )
}

export default Summary
