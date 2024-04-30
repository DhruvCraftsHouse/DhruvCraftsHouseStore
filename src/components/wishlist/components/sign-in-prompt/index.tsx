import Button from "@/components/common/components/button"
import Link from "next/link"

const SignInPrompt = () => {
  return (
    <div className="bg-white " style={{paddingTop:"10%",paddingBottom:"10%",background:"", width:"100%", display:"flex", alignItems:"center",justifyContent:"center"}}>
<div style={{textAlign:"center", padding:"5%", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"}}>
        <h2 className="text-xl-semi mb-5">Already have an account?</h2>
        <p className="text-base-regular text-gray-700 mt-2 mb-8">
          Sign in for a better experience.
        </p>
        <div>
        <Link href="/account/login">
          <Button >Sign in</Button>
        </Link>
      </div>
      </div>
     
    </div>
  )
}

export default SignInPrompt
