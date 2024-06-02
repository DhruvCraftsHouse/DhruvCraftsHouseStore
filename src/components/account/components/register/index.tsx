// Importing necessary /components and components
import { medusaClient } from "@/lib/config";  // Importing Medusa client configuration
import { LOGIN_VIEW, useAccount } from "@/lib/context/account-context";  // Importing context for login view and account
import Button from "@/components/common/components/button";  // Importing Button component
import Input from "@/components/common/components/input";  // Importing Input component
import Spinner from "@/components/common/icons/spinner";  // Importing Spinner component
import Link from "next/link";  // Importing Link from Next.js
import { useRouter } from "next/navigation";  // Importing useRouter from Next.js for routing
import { useState, useEffect } from "react";  // Importing useState from React
import { FieldValues, useForm } from "react-hook-form";  // Importing useForm from React Hook Form
import { toast } from 'react-toastify';  // Importing toast notification /library
import 'react-toastify/dist/ReactToastify.css';  // Importing styles for toast notifications
import { ToastContainer } from 'react-toastify';  // Importing ToastContainer from react-toastify
import { sendEmail } from "./sendEmail";  // Importing function for sending email
import { sendOTPEmail } from "./sendOTPEmail";  // Importing function for sending OTP email
import OtpInput from 'react-otp-input';  // Importing OTP input component
import { useRef } from 'react';  // Importing useRef from React
import FloatingLabelInput from "./FloatingLabelInput";  // Importing custom component FloatingLabelInput
import { emailPattern, passwordPattern, phonePattern, namePattern, phoneNumberPattern, lastNamePattern } from "@/lib/util/regex";

// Defining the interface for RegisterCredentials
interface RegisterCredentials extends FieldValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

const validatePassword = (password: string) => {
  console.log('password', password)
  const errors = [];
  if (password.length < 8) {
    console.log("must be at least 8 characters long");
    errors.push("must be at least 8 characters long");
  }
  if (!/[A-Za-z]/.test(password)) {
    console.log("include at least one letter");

    errors.push("include at least one letter");
  }
  if (!/\d/.test(password)) {
    console.log("include at least one number");

    errors.push("include at least one number");
  }

  return errors.length === 0 || `Password ${errors.join(', ')}.`;
};


// Main Register component
const Register = () => {
  // Hooks for managing state and context
  const { loginView, refetchCustomer } = useAccount();  // Destructuring login view and refetchCustomer from useAccount hook
  const [_, setCurrentView] = loginView;  // Ignoring the first element of loginView and using setCurrentView for changing view
  const [authError, setAuthError] = useState<string | undefined>(undefined);  // State for handling authentication errors
  const router = useRouter();  // Getting router object from Next.js
  const [generatedOTP, setGeneratedOTP] = useState(Math.floor(10000 + Math.random() * 90000).toString());  // State for generated OTP

  const [otp, setOtp] = useState('');  // State for OTP input
  const [showOtpInput, setShowOtpInput] = useState(false);  // State for displaying OTP input
  const [otpSubmitted, setOtpSubmitted] = useState(false);  // State for tracking OTP submission
  const [credentials, setCredentials] = useState<RegisterCredentials | null>(null);  // State for user credentials
  const [isActive, setIsActive] = useState(false);  // State for user activation
  const [consecutiveInvalidAttempts, setConsecutiveInvalidAttempts] = useState(0);

  // console.log("genertaed otp first ", generatedOTP);  // Logging the generated OTP

  // Error handling function
  const handleError = (e: Error) => {
    setAuthError("An error occurred. Please try again.");  // Setting authentication error
  }

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    resetField,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterCredentials>({
    mode: "onChange"
  });  // Initializing useForm with RegisterCredentials

  useEffect(() => {
    setValue('phone', '+91');
  }, []);

  // Function to create a new customer and handle email verification
  const createCustomer = async (credentials: any) => {
    try {
      // console.log("Running on server");
      // console.log("credentials at create customer", credentials);
      sendEmail(credentials);
      await medusaClient.customers.create(credentials)
        .then(() => {
          refetchCustomer();
          console.log("First name:", credentials.first_name);
          console.log("Last name:", credentials.last_name);
          console.log("Email:", credentials.email);
          router.push("/account");
        })
        .catch(handleError);
    } catch (error) {
      // Type checking the error
      if (error instanceof Error) {
        console.error("Error creating customer:", error.message);
        // Check if the error message indicates that the user already exists
        if (error.message.includes("User already exists")) {
          toast.error("User already exists. Please log in.");
          router.push("/account/login");
        } else {
          toast.error("An error occurred while creating the account. Please try again.");
        }
      } else {
        console.error("An unexpected error occurred");
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Form submission handler
  const onSubmit = handleSubmit(async (credentials) => {
    // console.log("credentials ", credentials);  // Logging user credentials
    setCredentials(credentials);  // Setting user credentials

    // Validation checks
    if (!passwordPattern.test(credentials.password)) {
      console.log("inside toast error passwordPattern ",passwordPattern," credentials.password ",);
      toast.error("Password should be at least 8 characters long and should include at least one letter, one number, and one special character.");  // Displaying password error toast
      return;
    }

    if (!emailPattern.test(credentials.email)) {
      toast.error("Invalid email");  // Displaying email error toast
      return;
    }

    if (credentials.phone && !phonePattern.test(credentials.phone)) {
      toast.error("Invalid phone number");  // Displaying phone number error toast
      return;
    }

    // Send OTP to the provided email
    try {
      // Check if the customer already exists
      const response = await medusaClient.auth.exists(credentials.email);
      // console.log("medusa check mail existence response", response.exists)

      if (response.exists) {
        // If customer already exists
        toast.error("Customer email already exists. Please log in.");
        setShowOtpInput(false);
        return;  // Exit the function without sending OTP email
      } else {
        // If validations pass, show OTP input
        setShowOtpInput(true);  // Displaying OTP input
      }
    } catch (error) {
      console.error("Error checking customer existence:", error);
      toast.error("An error occurred while checking the account. Please try again.");
      return;  // Exit the function due to error
    }

    // Send OTP to the provided email if customer does not exist
    await sendOTPEmail(credentials.email, generatedOTP);  // Sending OTP email
  });

  const handleClearForm = () => {
    resetField("first_name");
    resetField("last_name")
    resetField("email")
    resetField("phone")
    resetField("password")
  };

  const formRef = useRef<HTMLFormElement>(null);  // Creating a ref for the form element

  return (
    <div className="max-w-sm flex flex-col items-center mt-12">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <ToastContainer />
      {/* Toast container for displaying notifications */}

      {showOtpInput && (
        <form onSubmit={(e) => {
          e.preventDefault();  // Preventing default form submission
          if (otp) {
            // console.log("input from form", otp);  // Logging OTP from the form
            // console.log("credentials at OTPInput ", credentials);  // Logging user credentials at OTP input
            setOtp(otp);  // Setting OTP
            setOtpSubmitted(true);  // Marking OTP as submitted
            // console.log("otp ", otp, "generated OTP ", generatedOTP);
            // Check if entered OTP matches the generated OTP
            if (otp === generatedOTP) {
              setConsecutiveInvalidAttempts(0); // Reset the counter
              createCustomer(credentials);
            } else {
              setConsecutiveInvalidAttempts((prevCount) => prevCount + 1);
              if (consecutiveInvalidAttempts >= 2) {
                // Navigate to /account when three consecutive invalid attempts are reached
                router.push("/account");
              } else {
                toast.error("Invalid OTP");
                setOtp('');
                setOtpSubmitted(false);
              }
            }
          }
        }}>
          <p className="text-center text-base-regular text-gray-700 mb-4">
            Enter the OTP sent to your mail <span style={{ fontWeight: "bold" }}>{credentials?.email}</span>
          </p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={5}
            renderInput={(props) => (
              <input {...props} style={{ width: '3rem', height: '3rem', margin: '20px 1rem', fontSize: '1rem', border: '2px solid rgba(0,0,0,0.3)', textAlign: "center" }} />
            )}
          />
          <div className="button-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <button type="submit" style={{ background: "black", color: "white", padding: "10px 15px" }}>Enter OTP</button>
          </div>
        </form>
      )}

      {!showOtpInput && (
        <div>
          <h1 className="text-large-semi uppercase mb-6">Become a Acme Member</h1>
          <p className="text-center text-base-regular text-gray-700 mb-4">
            Create your Acme Member profile, and get access to an enhanced shopping experience.
          </p>

          <form className="w-full flex flex-col mt-9" onSubmit={onSubmit}>
            <div className="flex flex-col w-full gap-y-2">

              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Input
                  id="first_name"
                  label="First Name"
                  className={`custom-input wide-input ${errors.first_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-3 pb-0 block w-full h-11 px-4 -mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
                    }`}
                  {...register("first_name", { required: "First name is required" ,
                    pattern: {
                      value: namePattern,
                      message: "First name must contain only alphabetic characters"
                    }
                  })}
                  autoComplete="given-name"
                  errors={errors}
                />
                {errors.first_name && <span className="error-icon">!</span>}
              </div>
              {errors.first_name && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.first_name.message}</span>}

              {/* Last Name Input */}
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Input
                  id="last_name"
                  label="Last Name"
                  className={`custom-input wide-input ${errors.last_name ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
                  {...register("last_name", { required: "Last name is required" ,
                    pattern: {
                      value: lastNamePattern,
                      message: "Last name must contain only alphabetic characters"
                    }
                  })}
                  autoComplete="family-name"
                  errors={errors}
                />
                {errors.last_name && <span className="error-icon">!</span>}
              </div>
              {errors.last_name && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.last_name.message}</span>}

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
                />
                {errors.email && <span className="error-icon">!</span>}
              </div>
              {errors.email && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.email.message}</span>}

              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Input
                  label="Phone"
                  id="phone"
                  className={`custom-input wide-input ${errors.phone ? 'pt-4 pb-1 block w-full h-11 px-4 mt-0 error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: phoneNumberPattern,
                      message: "Please enter phone number in format +91XXXXXXXXXX"
                    }
                  })}
                  autoComplete="tel"
                  errors={errors}
                  defaultValue={"+91"}
                />
                {errors.phone && <span className="error-icon">!</span>}
              </div>
              {errors.phone && <span className="-mt-2 mb-3 pl-2 text-rose-500 text-xsmall-regular">{errors.phone.message}</span>}

              <div className="input-wrapper" style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  id="password"
                  className={`custom-input wide-input ${errors.password ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
                  {...register("password", {
                    required: "Password is required",
                    validate: validatePassword
                  })}
                  type="password"
                  autoComplete="new-password"
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
            <span className="text-center text-gray-700 text-small-regular mt-6">
              By creating an account, you agree to Dhruv Crafts House&apos;s{" "}
              <Link href="/content/privacy-policy" className="underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/content/terms-of-use" className="underline">
                Terms of Use
              </Link>
              .
            </span>
            <div className="button-container flex w-full mt-6 gap-2">
              <Button className="flex-grow" style={{ flexBasis: '75%' }}>Join</Button>
              <Button variant="secondary" type="reset" onClick={handleClearForm} className="flex-grow" style={{ flexBasis: '25%' }}>Clear</Button>
            </div>
          </form>

          <span className="text-center text-gray-700 text-small-regular mt-6">
            Already a member?{" "}
            <button
              onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
              className="underline mt-5"
            >
              Sign in
            </button>
            .
          </span>
        </div>
      )}
      <style>
        {`
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
}

export default Register;
