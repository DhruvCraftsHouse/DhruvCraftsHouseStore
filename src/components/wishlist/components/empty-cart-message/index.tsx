import InteractiveLink from "@/components/common/components/interactive-link"
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Image component


const EmptyCartMessage = () => {
  const router = useRouter();

  return (
    <div className="bg-amber-100 px-8 py-24 flex flex-col justify-center items-center text-center" style={{width:"100%"}}>
       {/* Display the empty-cart image */}
       <div className="">
        <Image
          src="/empty-wishlist.png" // Path to your empty-cart image in the public directory
          alt="Empty Cart"
          width={200} // Set the desired width
          height={100} // Set the desired height
        />
      </div>
      <h1 className="text-2xl-semi">Your wishlist is empty</h1>
      <p className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        You don&apos;t have anything in your wishlist. Let&apos;s change that, use
        the link below to start browsing our products.
      </p>
     {/* Apply hover effect to the button */}
     <div className="transition-transform transform hover:scale-102">
      <Button
 variant="outlined"
 style={{
    border: "1px solid black",
    color: "black",
    borderRadius: "0px",
    fontWeight: 600,
    transition: "transform 0.3s ease", // Add a transition effect
    transform: "scale(1)", // Initial scale
 }}
 onMouseEnter={(event) => {
    event.currentTarget.style.transform = "scale(1.02)"; // Scale up on mouse enter
 }}
 onMouseLeave={(event) => {
    event.currentTarget.style.transform = "scale(1)"; // Scale down on mouse leave
 }}
 onClick={() => router.push("/store")}
>
 Explore our products
</Button>



      </div>
    </div>
  )
}

export default EmptyCartMessage
