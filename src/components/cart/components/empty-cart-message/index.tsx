import { Heading, Text } from "@medusajs/ui"
import UnderlineLink from "@/components/common/components/interactive-link"
//customized UI for empty cart - additional imports
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import Image from "next/image"; // Import the Image component

const EmptyCartMessage = () => {
  const router = useRouter();

  //changed code for returned display  making customized UI for empty cart
  return (
    <div
      className="py-18 flex flex-col justify-center items-start"
      style={{
        background: "",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Klein, sans-serif",
      }}
    >
      
      {/* Display the empty-cart image */}
      <div className="">
        <Image
          src="/empty-cart.webp" // Path to your empty-cart image in the public directory
          alt="Empty Cart"
          width={200} // Set the desired width
          height={100} // Set the desired height
        />
      </div>

      <Text className="text-large-regular mt-4 mb-1 max-w-[32rem]" style={{ fontWeight: 600 }}>
        Hey, your cart feels so light!
      </Text>
      <Text className="text-base-regular mb-6 max-w-[32rem]">
        Let&apos;s change that, start browsing our products.
      </Text>

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
  );
}

export default EmptyCartMessage
