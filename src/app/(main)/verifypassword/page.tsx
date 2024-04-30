"use client";

import React, {useState, useEffect} from "react";
import { medusaClient } from "@/lib/config"
import { LOGIN_VIEW, useAccount } from "@/lib/context/account-context"
import Button from "@/components/common/components/button"
import Input from "@/components/common/components/input"
import Spinner from "@/components/common/icons/spinner"
import { useRouter } from "next/navigation"
import { FieldValues, useForm } from "react-hook-form"
import Medusa from "@medusajs/medusa-js"
import { updatePassword } from "./updatePassword"
import { passwordPattern, emailPattern } from "@/lib/util/regex";
import { toast } from "react-toastify"; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })


function decryptEmail(urlEmail: string): string {
   
    let decryptedEmailArray = urlEmail.split('');
    for (let i = 0; i < decryptedEmailArray.length; i++) {
      let charCode = decryptedEmailArray[i].charCodeAt(0);
      charCode += 10;
      decryptedEmailArray[i] = String.fromCharCode(charCode);
    }
    return decryptedEmailArray.join('');
   }

   
   interface SignInCredentials extends FieldValues {
    email: string
    password: string
  }

export default function ResetPasswordPage(){
    const [token, setToken ]= useState("");
    const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const router = useRouter()
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // State for toast message

    useEffect(()=>{

        const urlToken = new URLSearchParams(window.location.search).get('token');
// console.log("Token at resetPassword: ", urlToken);

const urlEmail = new URLSearchParams(window.location.search).get('verify');
// console.log("Email at resetPassword: ", urlEmail);

let decryptedEmail = '';
if (urlEmail !== null) {
   decryptedEmail = decryptEmail(urlEmail);
}


// console.log("Decrypted email at resetPassword: ", decryptedEmail);
setEmail(decryptedEmail)

    },[])
    const handleError = (_e: Error) => {
        setAuthError("Invalid email or password")
      }
    
    
      const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
        setValue,
        setError
       } = useForm<SignInCredentials>({mode:"onChange"});
       
       
       const handleUpdatePassword = (event: any) => {
        event.preventDefault();
        const enteredEmail = event.target.elements.email.value;
        const newPassword = event.target.elements.password.value;
       
        // Set the password value using setValue from react-hook-form
        setValue("password", newPassword);
        // console.log("entered Emial", enteredEmail, "new password ",newPassword)
       
        // Check if the entered password matches the passwordPattern
    if (!passwordPattern.test(newPassword)) {
      // Display a toast error message
      toast.error("Enter a valid password");
      return;
    }
        // Check if the entered password is the actual correct password
        medusa.auth.getToken({
          email: enteredEmail,
          password: newPassword
         })
         .then(({ access_token }) => {
          // console.log("access token ",access_token)
          if (access_token) {
            setError("password", {
              type: "manual",
              message: "You have entered the old password. Please enter a new password."
            });
            return;
          }
          else{
            updatePassword(enteredEmail, newPassword)
            .then(() => {
              // Navigate to the '/login' route on success
              // console.log("reset successful")
              router.push("/account")
            })
            .catch((error) => {
              // Handle the error
              console.error("Error:", error);
            });
          }
         })
         .catch((error) => {
          updatePassword(enteredEmail, newPassword)
            .then(() => {
              // Navigate to the '/login' route on success
              // console.log("reset successful")
              router.push("/account")
            })
            .catch((error) => {
              // Handle the error
              console.error("Error:", error);
            });
          console.log("Error: at access token", error);
         });
         
       
      
       };
       
       
    
      return (
        <div style={{ display:"flex", alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div className="max-w-sm w-full flex items-center justify-center" >
          <ToastContainer />
          {isSubmitting && (
            <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <Spinner size={24} />
            </div>
          )}
          <div className="w-full flex justify-center items-center py-24">
            <form  className="w-full" onSubmit={handleUpdatePassword}>
                    <h1 className="text-large-semi uppercase mb-6 " style={{textAlign:"center"}}>Reset your Password</h1>
                    <p className=" text-base-regular text-gray-700 mb-5 mt-5" style={{textAlign:"left"}}>
                    Enter your email address
                  </p>
                  <div className="input-wrapper" style={{ position: 'relative' }}>

<Input
  label="Email"
  id="email"
  className={`custom-input wide-input ${errors.email ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
  {...register("email", { required: "Email is required",
  pattern: {
    value: emailPattern,
    message: "Please enter a valid email"
  }
})}
  autoComplete="email"
  errors={errors}
  defaultValue={email}
  disabled
  // touched={touchedFields}

/>
{errors.email && <span className="error-icon">!</span>}
</div>
{errors.email && <span className="error-message">{errors.email.message}</span>}

             <p className=" text-base-regular text-gray-700 mb-5 mt-5" style={{textAlign:"left"}}>
                  Enter your new password
                </p>
                <div className="input-wrapper" style={{ position: 'relative' }}>

<Input
  label="Password"
  id="password"
  className={`custom-input wide-input ${errors.password ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
  {...register("password", {
    required: "Password is required",
    pattern: {
      value: passwordPattern,
      message: "Password must be at least 8 characters long, include at least one number."

    }
  })}
  type="password"
  autoComplete="new-password"
  errors={errors}
  // touched={touchedFields}

/>
{errors.password && <span className="error-icon">!</span>}
</div>
{errors.password && <span className="error-message">{errors.password.message}</span>}

            <Button type="submit" className="mt-5">Update Password</Button>
            </form>
            </div>
    
          <style>
            {`
            .left-align input::placeholder {
              text-align: left;
             }
             
            .forgot-password-link:hover {
              color:#0000FF;
              text-decoration: underline;
             }

             .custom-input {
              // font-size: 1rem;
              // padding-top: 25px !important;
              // padding: 0px 0px !important;
            }
            .wide-input {
              width: 100%;
            }
            .normal-border {
              border: 1px solid black;
            }
            .error-border {
              border: 1px solid red;
              border-radius: 5px;
            }
            .error-icon {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: red;
              color: white;
              font-size: 16px;
              text-align: center;
              line-height: 20px;
            }
            .error-message {
              color: red;
              font-size: 0.67rem;
              font-weight: 400;
              width: 100%;
              margin-top: 4px;
            }
             `}
          </style>
        </div>
        </div>
      )
    }
    
    