"use client";

import { Popover, Transition } from "@headlessui/react"
import { useStore } from "@/lib/context/store-context"
import useEnrichedLineItems from "@/lib/hooks/use-enrich-line-items"
import { Button } from "@medusajs/ui"
import LineItemOptions from "@/components/common/components/line-item-options"
import LineItemPrice from "@/components/common/components/line-item-price"
import Trash from "@/components/common/icons/trash"
import Thumbnail from "@/components/products/components/thumbnail"
import { formatAmount, useCart } from "medusa-react"
import Link from "next/link"
import { Fragment } from "react"
import { useAccount, LOGIN_VIEW } from "@/lib/context/account-context"
import { DropdownMenu } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/loader';



const AccountDropdown = () => {

  const items = useEnrichedLineItems()
  const { state, open, close } = useAccount()
  const { customer } = useAccount();
  const { loginView, refetchCustomer } = useAccount();  // Destructuring login view and refetchCustomer from useAccount hook
  const [_, setCurrentView] = loginView;  // Ignoring the first element of loginView and using setCurrentView for changing view
  const { handleLogout } = useAccount()
  const router = useRouter();

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
  // console.log("Link clicked with path:", targetPath);
  setClickedPath(targetPath); // Update clickedPath to the target path
  setIsNavigating(true); // Assume navigation is starting
};

  return (
    <>
      {isNavigating && <LoadingSpinner />}
    <div className="h-full z-50" onMouseEnter={open} onMouseLeave={close}>
      <Popover className="relative h-full">
      <Popover.Button className="h-full ml-1">
          <div style={{ width: '80px'}}>
            {/* Check if customer exists */}
            {customer ? (
              <div>
                Hello,<span style={{ fontWeight: 'bold' }}>{customer.first_name}</span>
                <br />
                {customer.billing_address?.postal_code && (
                  <Link className="hover:text-ui-fg-base" href="/cart" 
                  // onClick={ ()=> handleLinkClick('/cart') }
                  >
                    Deliver to <span style={{ fontWeight: 'bold' }}>{customer.billing_address.postal_code}</span>
                  </Link>
                )}
              </div>
            ) : (
              // Show Sign In button if customer does not exist
              <Link href="/account"  
               onClick={()=>{
                setCurrentView(LOGIN_VIEW.SIGN_IN)
                // handleLinkClick('/account/login')
              }}>
                SIGN IN
                {/* <Button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} style={{padding:"6px 9px", borderRadius:"0px"}}>Sign In</Button> */}
              </Link>
            )}
          </div>
        </Popover.Button>
        {customer && (
        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
     <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[250px] text-gray-900 p-9"
          >
<div className=" flex flex-col pb-3">
   <h3 className="text-base-semi">{customer?.first_name} {customer?.last_name}</h3>
   <h3 className="text-base-semi" style={{fontWeight: 400,letterSpacing:"0.05em"}}>{customer?.email}</h3>
 </div>
 <hr />
 <div className="p-1 flex flex-col">
   <button onClick={()=>router.push("/account/profile")} className="block p-2" style={{ textAlign:"left"}}>Profile</button>
   <button onClick={handleLogout} className="block p-2"  style={{ textAlign:"left"}}>Logout</button>
 </div>
</Popover.Panel>


        </Transition>
        )}
      </Popover>
    </div>
    </>
  )
}

export default AccountDropdown
