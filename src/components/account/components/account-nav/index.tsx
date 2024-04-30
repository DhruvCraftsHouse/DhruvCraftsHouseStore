import { useAccount } from "@/lib/context/account-context"
import ChevronDown from "@/components/common/icons/chevron-down"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"


const AccountNav = () => {
  const route = usePathname()
  const { handleLogout } = useAccount()

  return (
    <div>
      <div className="small:hidden">
        {route !== "/account" && (
          <Link
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Account</span>
            </>
          </Link>
        )}
      </div>
      <div className="hidden small:block">
        <div>
          <div className="py-4">
            <h3 className="text-large-semi">Account</h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              <li>
                <AccountNavLink href="/account" route={route!}>
                  Overview
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/account/profile" route={route!}>
                  Profile
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/account/addresses" route={route!}>
                  Addresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink href="/account/orders" route={route!}>
                  Orders
                </AccountNavLink>
              </li>
              <li className="text-grey-700">
                <button type="button" onClick={handleLogout}>
                  Log out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
}

const AccountNavLink = ({ href, route, children }: AccountNavLinkProps) => {
   // Ensure href and route are treated the same way
   const normalizedHref = href.trim().toLowerCase();
   const normalizedRoute = route.trim().toLowerCase();
 
   // Remove trailing slash if it exists
   const finalHref = normalizedHref.endsWith('/') ? normalizedHref.slice(0, -1) : normalizedHref;
   const finalRoute = normalizedRoute.endsWith('/') ? normalizedRoute.slice(0, -1) : normalizedRoute;
 
   const active = finalRoute === finalHref;
 
   if (active) {
     console.log('Active link:', finalHref);
   } else {
     console.log('Inactive link:', finalHref);
     console.log('Current route:', finalRoute);
   }
  return (
    <Link
      href={href}
      className={clsx("text-gray-700", {
        "text-gray-900 font-semibold": active,
      })}
    >
      <>{children}</>
    </Link>
  )
}

export default AccountNav
