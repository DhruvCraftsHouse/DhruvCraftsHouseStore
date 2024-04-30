"use client"

import React, { useState, useEffect} from 'react'
import Link from 'next/link'
import SearchComponent from '../search-component'
import MobileMenu from '../mobile-menu/templates'
import useToggleState from "@/lib/hooks/use-toggle-state"
import { useMobileMenu } from "@/lib/context/mobile-menu-context"
import Hamburger from '@/components/common/components/hamburger'
import { usePathname } from 'next/navigation'
import SideMenu from '../side-menu'
import CartDropdown from '../cart-dropdown'
import AccountDropdown from '../account-dropdown'


const Nav = () => {
  const { toggle } = useMobileMenu()
  const {
    state: searchModalState,
    close: searchModalClose,
    open: searchModalOpen,
  } = useToggleState()

  const pathname = usePathname();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [navStyle, setNavStyle] = useState({ fontFamily: "Avenir Next LT W02 Regular", background: "#F5F6FA", color:"black" });
  const specialPaths = [
    '/contact'
  ];

  useEffect(() => {
    window.addEventListener("scroll", updateNavStyle);
    updateNavStyle(); // Call updateNavStyle to set the initial style based on the pathname

    return () => {
      window.removeEventListener("scroll", updateNavStyle);
    };
  }, [pathname]); // Add pathname as a dependency to re-run the effect when the path changes

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

  const handleSideMenuOpenChange = (isOpen: boolean) => {
    setIsSideMenuOpen(isOpen);
    // console.log('SideMenu open state now:', isOpen); // Correctly reflects the action
  };

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
    <header className="relative h-16 px-8 mx-auto border-b duration-200 bg-white border-ui-border-base">
      <nav className="txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
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
/>           
 </div>
        </div>

        <div className="flex items-center h-full">
          <Link
            href="/"
            className="txt-compact-xlarge-plus"
          >
            Dhruv Crafts House
          </Link>
        </div>

        <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
          <div className="hidden small:flex items-center gap-x-6 h-full">
            {/* {process.env.FEATURE_SEARCH_ENABLED && (
              <DesktopSearchModal
                state={searchModalState}
                close={searchModalClose}
                open={searchModalOpen}
              />
            )} */}
              <SearchComponent isSideMenuOpen={isSideMenuOpen} />
              <Link className="" href="/wishlist">
              Wishlist
            </Link>
            <AccountDropdown />
              {/* <Link className="" href="/account">
              Account
            </Link> */}
          </div>
          <CartDropdown />
        </div>
      </nav>
      <MobileMenu />
    </header>
  </div>  )
}

export default Nav