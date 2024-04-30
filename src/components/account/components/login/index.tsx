// Importing necessary /components and /libraries
import { medusaClient } from "@/lib/config";
import { LOGIN_VIEW, useAccount } from "@/lib/context/account-context";
import Button from "@/components/common/components/button";
import Input from "@/components/common/components/input";
import Spinner from "@/components/common/icons/spinner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Medusa from "@medusajs/medusa-js";
import { resetPassword } from "./resetPassword";
import { verifyEmail } from "./verifyEmail";
import { toast } from 'react-toastify';  // Importing toast notification /library
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for toast notifications
import { ToastContainer } from 'react-toastify';  // Importing ToastContainer from react-toastify
import { emailPattern, passwordPattern, phonePattern, namePattern, phoneNumberPattern, lastNamePattern } from "@/lib/util/regex";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

// Defining the interface for SignInCredentials
interface SignInCredentials extends FieldValues {
  email: string;
  password: string;
}

// Definition of the Login component
const Login = () => {
  // Accessing account-related context and state using useAccount
  const { loginView, refetchCustomer } = useAccount();
  const [_, setCurrentView] = loginView;
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);


  // Function to handle authentication errors
  const handleError = (_e: Error) => {
    setAuthError("Invalid email or password");
  };

  // React Hook Form configuration
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    setError
   } = useForm<SignInCredentials>({    mode: "onChange"
  });
   

  // Function to show the password reset form
  const forgotPassword = () => {
    setShowForm(true);
  };
  

  // Function to handle password reset
  const handleResetPassword = async (event: any) => {

    try {
      event.preventDefault();
      const enteredEmail = event.target.elements.email.value;
      setEmail(enteredEmail);
    
      // Check if the customer already exists
      const response = await medusaClient.auth.exists(enteredEmail);
      console.log("Medusa check mail existence response", response.exists);
  
      // if (!response.exists) {
      //   // If customer does not exist
      //   toast.error("Customer email does not exist. Please register.");
      //   // setCurrentView(LOGIN_VIEW.REGISTER); // Optionally switch to the registration view
      //   return; // Exit the function without attempting login
      // }
  
      if (!response.exists) {
        setError("email", {
          type: "manual",
          message: "EMAIL DOES NOT EXIST. PLEASE REGISTER TO JOIN US.  Navigating to Sign Up page..."
        });
        
        setTimeout(() => {
          setCurrentView(LOGIN_VIEW.REGISTER); // Optionally switch to the registration view
        }, 4000);
       
        return;
       }

       setValue("password", "");
       setShowUpdateForm(true);
       setShowForm(false);
console.log("calling verifyEmail");
    verifyEmail(enteredEmail);

  } catch (error) {
    console.error("Error checking customer existence:", error);
    toast.error("An error occurred while checking the account. Please try again.");
  }
  };


  // Function to handle form submission
const onSubmit = handleSubmit(async (credentials) => {
  try {
    // Check if the customer already exists
    const response = await medusaClient.auth.exists(credentials.email);
    console.log("Medusa check mail existence response", response.exists);

    // if (!response.exists) {
    //   // If customer does not exist
    //   toast.error("Customer email does not exist. Please register.");
    //   // setCurrentView(LOGIN_VIEW.REGISTER); // Optionally switch to the registration view
    //   return; // Exit the function without attempting login
    // }

    if (!response.exists) {
      setError("email", {
        type: "manual",
        message: "EMAIL DOES NOT EXIST. PLEASE REGISTER TO JOIN US.  Navigating to Sign Up page..."
      });
      
      setTimeout(() => {
        setCurrentView(LOGIN_VIEW.REGISTER); // Optionally switch to the registration view
      }, 4000);
     
      return;
     }
     
     

    // Attempt to authenticate if the email exists
    await medusaClient.auth
    .authenticate(credentials)
    .then(() => {
      refetchCustomer();

      if (rememberMe) {
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('password', credentials.password); // Storing password like this is not recommended for security reasons
      }

      // Checking for specific email addresses for custom redirects
      // if (credentials.email === "kamyaartsaddmin@gmail.com") {
      //   router.push("http://localhost:7001/a/customers?offset=0&limit=15");
      // } else if (credentials.email === "kamyaartsceo@gmail.com") {
      //   router.push("http://localhost:7001/a/analytics");
      // } else {
        router.push("/account");
        console.log("account pushed after");
      // }
    })
    .catch((error) => {
      console.error("Authentication failed:", error);
      handleError(error);
    });

  } catch (error) {
    console.error("Error checking customer existence:", error);
    toast.error("An error occurred while checking the account. Please try again.");
  }
});


  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    
    if (savedEmail && savedPassword) {
      setValue('email', savedEmail);
      setValue('password', savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);
  
  // console.log("mail to check ", email);

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      {/* Displaying a spinner while submitting */}
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <ToastContainer />

      {/* Displaying a message after sending the activation link */}
      {showUpdateForm && (
        <p className="w-full text-base-regular mb-6 " style={{ textAlign: "center", width: "100%" }}>
          Activation link has been sent to your mail <span style={{ fontWeight: 600 }}>{email}</span>. Click the link in the mail to reset password
        </p>
      )}

      {/* Displaying the password reset form */}
      {showForm && (
        <form className="w-full" onSubmit={handleResetPassword}>
          <h1 className="text-large-semi uppercase mb-8" style={{ textAlign: "center" }}>Reset your Password</h1>
          {errors.email && <p style={{textAlign:"center"}} className="-mt-4 pl-2 mb-4 text-rose-500 text-base-regular flex items-center justify-center">
              {errors.email.message}</p>}
          <p className=" text-base-regular text-gray-700 mb-5 mt-8">
            Enter your email address
          </p>
          <div className="input-wrapper" style={{ position: 'relative' }}>

          <Input
            label="Email"
            id="email"
            {...register("email", { required: "Email is required",
            pattern: {
              value: emailPattern,
              message: "Please enter a valid email"
            }
           })}
           className={`custom-input wide-input ${errors.email ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
             autoComplete="email"
            errors={errors}
          />
          {errors.email && <span className="error-icon">!</span>}
              </div>
          <Button type="submit" className="mt-6">Reset Password</Button>
        </form>
      )}

      {/* Displaying the login form */}
      {!showForm && !showUpdateForm && (
        <div>
          <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
          <p className="text-center text-base-regular text-gray-700 mb-8">
            Sign in to access an enhanced shopping experience.
          </p>
          <form className="w-full" onSubmit={onSubmit}>

            <div className="flex flex-col w-full gap-y-2">
            {errors.email && <p style={{textAlign:"center"}} className="-mt-4 pl-2 mb-4 text-rose-500 text-base-regular flex items-center justify-center">
              {errors.email.message}</p>}

          
              <div className="input-wrapper" style={{ position: 'relative' }}>

<Input
id="email"
 label="Email"
 {...register("email", { required: "Email is required",
 pattern: {
   value: emailPattern,
   message: "Please enter a valid email"
 }
})}
// touched={touchedFields}
 autoComplete="email"
 className={`custom-input wide-input ${errors.email ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
 errors={errors}
/>
{errors.email && <span className="error-icon">!</span>}
              </div>
              <div className="input-wrapper" style={{ position: 'relative' }}>

              <Input
                label="Password"
                id="password"
                {...register("password", { required: "Password is required" })}
                type="password"
                autoComplete="current-password"
                className={`custom-input wide-input ${errors.password ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
                errors={errors}
              />
              {errors.password && <span className="error-icon">!</span>}
              </div>
                    {errors.password && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.password.message}</span>}

            </div>
            {authError && (
              <div>
                <span className="text-rose-500 w-full text-small-regular">
                  These credentials do not match our records
                </span>
              </div>
            )}
            <Button className="mt-6 mb-5 pb-5">Enter</Button>
            <a className="mt-6 pt-5 forgot-password-link" href="#" onClick={forgotPassword} style={{ fontSize: "15px", marginTop: "20px" }}>
              Forgot Password?
            </a>
          </form>
          <span className="text-center text-gray-700 text-small-regular mt-6">
            Not a member?{" "}
            <button
              onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
              className="underline"
            >
              Join us
            </button>
            .
          </span>
          <div className="checkbox-container">
  <input
    type="checkbox"
    id="rememberMe"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  <label htmlFor="rememberMe">Remember me</label>
</div>

        </div>
      )}

      {/* Styling for the forgot password link */}
      <style>
        {`
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        .checkbox-container {
          margin-top: 10px;
        }
        
        .checkbox-container input {
          margin-right: 5px;
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
          font-size: 0.8rem;
          margin-top: 4px;
        }
         `}
      </style>
    </div>
  );
};

// Exporting the Login component as the default export
export default Login;
