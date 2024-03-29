"use client"

import { useMobileMenu } from "@lib/context/mobile-menu-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import DropdownMenu from "@modules/layout/components/dropdown-menu"
import SideMenu from "@modules/layout/components/side-menu"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import LoadingSpinner from '@modules/loader';
//added dropdowns for customized nav
import AccountDropdown from '@modules/layout/components/account-dropdown';
import SearchComponent from "@modules/layout/components/search-component";
import DiscountBanner from "@modules/layout/components/discount-banner"
//added additional imports for discount banner
import { getDiscountList } from './customerDiscount';
import { Discount } from '@medusajs/medusa';
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context";  // Importing context for login view and account
import axios from 'axios';


// Define the ApiResponse interface
interface ApiResponse {
  discounts: Discount[];
  // other properties of ApiResponse
}

const Nav = () => {
  const { toggle } = useMobileMenu()
  const {
    state: searchModalState,
    close: searchModalClose,
    open: searchModalOpen,
  } = useToggleState()

  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  // Initialize clickedPath with the current pathname when the component mounts
  useEffect(() => {
    setClickedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    // Determine if navigation is occurring
    setIsNavigating(pathname !== clickedPath);
  }, [pathname, clickedPath]);

  // Function to handle link clicks
  const handleLinkClick = (targetPath: string) => {
    // Check if the target path is the same as the current pathname
    if (targetPath === pathname) {
      console.log("Already on the same page:", targetPath);
      // Do not proceed with navigation
      return;
    }
  
    console.log("Link clicked with path:", targetPath);
    setClickedPath(targetPath); // Update clickedPath to the target path
    setIsNavigating(true); // Assume navigation is starting
  };
  
  // Define your special paths
  const specialPaths = [
    '/customer-service'
  ];
  const [navStyle, setNavStyle] = useState({ fontFamily: "Avenir Next LT W02 Regular", background: "#F5F6FA", color:"black" });

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

const handleSideMenuOpenChange = (isOpen: boolean) => {
  setIsSideMenuOpen(isOpen);
  // console.log('SideMenu open state now:', isOpen); // Correctly reflects the action
};
useEffect(() => {
  // console.log('isSideMenuOpen has changed:', isSideMenuOpen);
}, [isSideMenuOpen]);
   // Adjust the updateNavStyle function to use the pathname from the hook
   const updateNavStyle = () => {
    const isSpecialPath = specialPaths.includes(pathname);
    const isScrolled = window.pageYOffset > 0;

    if (isSpecialPath && isScrolled) {
      setNavStyle({ fontFamily: "Avenir Next LT W02 Regular", background: "#FFFFFF", color:"black" });
    } else if (isSpecialPath) {
      setNavStyle({ fontFamily: "Avenir Next LT W02 Regular", background: "rgba(0,0,0,0.4)", color:"white" });
    } else {
      setNavStyle({ fontFamily: "Avenir Next LT W02 Regular", background: "#F5F6FA", color:"black" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", updateNavStyle);
    updateNavStyle(); // Call updateNavStyle to set the initial style based on the pathname

    return () => {
      window.removeEventListener("scroll", updateNavStyle);
    };
  }, [pathname]); // Add pathname as a dependency to re-run the effect when the path changes


  //following are the additional codes for discountbanner 
  const { customer } = useAccount()
    // State to store discounts
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [hasDiscountData, setHasDiscountData] = useState(false);
  const [isVipCustomer, setIsVipCustomer] = useState(false);
  const [specificDiscount, setSpecificDiscount] = useState<Discount | null>(null);

  // Function to format the date in the desired format
  const formatDate = (date: Date) => {
    const currentDate = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    // Check if the year is the same as the current year
    if (date.getFullYear() === currentDate.getFullYear()) {
      return `${day}${getDaySuffix(day)} of ${month}`;
    } else {
      const year = date.getFullYear();
      return `${day}${getDaySuffix(day)} of ${month} ${year}`;
    }
  };

  // Function to get the suffix for the day (e.g., 1st, 2nd, 3rd, 4th)
  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currencySymbols: Record<string, string> = {
      usd: "$",
      eur: "€",
      gbp: "£",
      inr: "₹", // Add INR and its symbol
      // Add more currency codes and symbols as needed
    };

    // Use type assertion to specify that currencyCode is a valid key
    return currencySymbols[currencyCode as keyof typeof currencySymbols] || currencyCode;
  };
  useEffect(() => {
    // Find the discount with customer groups condition
    const resultDiscount = discounts.find(discount =>
      discount.rule.conditions.some(condition => condition.type === "customer_groups")
    ) || null;

    setSpecificDiscount(resultDiscount);
  }, [discounts]); // Dependency array includes discounts

  const fetchVipStatus = async () => {
    if (customer && customer.id) {
      try {
        // Construct the URL with query parameters
        const response = await getDiscountList();
        const vipCustomerUrl = `http://195.35.20.220:9000/store/vipCustomer?customer_id=${customer.id}&group_id=${response.data.customer_groups[0].id}`;

        // Make the request to check if the customer is a VIP customer
        const boolResponse = await axios.get(vipCustomerUrl);
        setIsVipCustomer(boolResponse.data.found); // Update the state variable
      } catch (error) {
        console.error("Error fetching VIP status:", error);
      }
    } else {
      setIsVipCustomer(false); // Set isVipCustomer to false if customer or customer.id doesn't exist
    }
  };

  useEffect(() => {
    fetchVipStatus();
  }, [customer]); // Depend on the customer object

  // Render the VIP customer message
  const renderVipMessage = () => {
    if (isVipCustomer) {
      return (
        <div className="vip-message" style={{ color: '#f7cf02', fontWeight: 'bold' }}>
          YOU ARE A VIP CUSTOMER 👑
        </div>
      );
    }
    return null;
  };
  const renderSpecificDiscountMessage = () => {
    if (specificDiscount && isVipCustomer) {
      let discountMessage;

      // Check the type of the discount and build the message accordingly
      switch (specificDiscount.rule.type) {
        case "percentage":
          discountMessage = `For ${specificDiscount.rule.value}% OFF use code ${specificDiscount.code}`;
          break;
        case "fixed":
          const currencySymbol = getCurrencySymbol(specificDiscount.regions[0].currency_code);
          discountMessage = `For ${currencySymbol}${specificDiscount.rule.value / 100}/- OFF use code ${specificDiscount.code}`;
          break;
        case "free_shipping":
          discountMessage = `For Free Shipping Charges use code ${specificDiscount.code}`;
          break;
        default:
          discountMessage = `Use CODE ${specificDiscount.code}`;
      }

      return (
        <div className="discount-message">
          <p style={{ color: '#f7cf02', fontWeight: 500 }}>
            <span style={{ textDecoration: "" }}>
              {discountMessage}
            </span>
            {specificDiscount.ends_at && (
              <span className="validity-message">
                {" "}
                - <span style={{ textDecoration: "" }}>Valid only till {formatDate(new Date(specificDiscount.ends_at))}</span>
              </span>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse>("http://195.35.20.220:9000/store/discountlist");
      // console.log('response.data.discounts', response.data.discounts)
      if (response.status === 200 && response.data && response.data.discounts) {
       

        const currentDate = new Date();

        // console.log('currentDate', currentDate)

        const currentDiscounts = response.data.discounts.filter((discount) => 
 !discount.ends_at || new Date(discount.ends_at) > currentDate
);

// console.log('currentDiscounts', currentDiscounts)

const activeDiscounts = currentDiscounts.filter((discount) => !discount.is_disabled);
// console.log('activeDiscounts nav', activeDiscounts)

setDiscounts(activeDiscounts); // Set the discounts state
if(activeDiscounts.length > 0)
{
  setHasDiscountData(true); // Set to true if data is available

}
      } else {
        setHasDiscountData(false); // Set to false if no data or error
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasDiscountData(false); // Set to false in case of an error
    }
  };
  

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>
    {isNavigating && <LoadingSpinner />}
  <div className="sticky top-0 inset-x-0 z-50 group" style={navStyle}>
  {hasDiscountData && (

<div className="txt-xsmall-plus flex flex-col items-center w-full h-full text-small-regular" style={{ background: "black", color: "white" }}>
  <div className="mt-4 mb-2" style={{ flex: 1 }}>
    {renderVipMessage()}
  </div>
  <div className="mb-2" style={{ flex: 1 }}>
    {renderSpecificDiscountMessage()}
  </div>
</div>
)}
{hasDiscountData && (

<div className="txt-xsmall-plus flex items-center w-full h-full text-small-regular" style={{ background: "black", color: "white" }}>
  {/* Center the yellow div using flexbox */}
  <div className="flex items-center justify-center mt-4 mb-2" style={{ flex: 1 }}>
    <DiscountBanner />
  </div>
</div>
)}
      <header className="relative h-16 px-8 py-1 mx-auto border-b duration-200 border-ui-border-base">
        <div className="txt-xsmall-plus flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="block small:hidden">
              <Hamburger setOpen={toggle} />
            </div>
            {/* hidden small:block and hidden small:flex - not displayed in mobile view */}
            {/* small:hidden - displayed in mobile view */}
            <div className="hidden small:block h-full">
            <SideMenu
  navBackground={navStyle.background} // Add this line
  searchModalOpen={searchModalOpen}
  onOpenChange={handleSideMenuOpenChange}
/>            </div>
          </div>

          <div className="flex items-center h-full">
          <Link
   href="/store"
   className="txt-compact-xlarge-plus"
   style={{fontFamily:"Avenir Next LT W02 Regular"}}
   onClick={() => handleLinkClick('/store')}>
     
              Dhruv Crafts House
            </Link>
            
          </div>

          <div className="flex items-center gap-x-5 h-full flex-1 basis-0 justify-end" style={{
            fontWeight: isSideMenuOpen? "600" : "400",
    // letterSpacing: "0.2em",
    // background:"red",
    fontFamily: "Avenir Next LT W02 Regular", // Conditional fontFamily
 }}>
            <div className="hidden small:flex items-center gap-x-5 h-full">
              {/* {process.env.FEATURE_SEARCH_ENABLED && (
                <DesktopSearchModal
                  state={searchModalState}
                  close={searchModalClose}
                  open={searchModalOpen}
                />
              )} */}
              {/* <Link className="hover:text-ui-fg-base" href="/account">
                Account
              </Link> */}

              <SearchComponent isSideMenuOpen={isSideMenuOpen} />
              <Link className="" href="/wishlist">
                Favorites
              </Link>
              <AccountDropdown />

            </div>
            <CartDropdown />
          </div>
        </div>
       
        <MobileMenu />
      </header>
      </div>
    </>
  )
}

export default Nav
