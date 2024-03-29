"use client"

import { medusaClient } from "@lib/config"
import { Customer } from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"
import { useMeCustomer } from "medusa-react"
import { useRouter } from "next/navigation"
import React, { createContext, useCallback, useContext, useState, useEffect } from "react"
//added functionalities for toggle state for customized account context and dropdown
import useToggleState from "@lib/hooks/use-toggle-state"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

interface AccountContext {
  customer?: Omit<Customer, "password_hash">
  retrievingCustomer: boolean
  loginView: [LOGIN_VIEW, React.Dispatch<React.SetStateAction<LOGIN_VIEW>>]
  checkSession: () => void
  refetchCustomer: () => void
  handleLogout: () => void
  //added functionalities for toggle state for customized account context and dropdown
  state: boolean
  open: () => void
  timedOpen: () => void
  close: () => void
}

const AccountContext = createContext<AccountContext | null>(null)

interface AccountProviderProps {
  children?: React.ReactNode
}

const handleDeleteSession = () => {
  return medusaClient.auth.deleteSession()
}

  //added functionalities for toggle state for customized account context and dropdown
export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { state, close, open } = useToggleState()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const {
    customer,
    isLoading: retrievingCustomer,
    refetch,
    remove,
  } = useMeCustomer({ onError: () => {} })

  const loginView = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  const router = useRouter()

  const checkSession = useCallback(() => {
    if (!customer && !retrievingCustomer) {
      router.push("/account/login")
    }
  }, [customer, retrievingCustomer, router])

  const useDeleteSession = useMutation({
    mutationFn: handleDeleteSession,
    mutationKey: ["delete-session"],
  })

  const handleLogout = () => {
    useDeleteSession.mutate(undefined, {
     onSuccess: () => {
       remove();
       loginView[1](LOGIN_VIEW.SIGN_IN);
       router.push("/");
   
   
     },
    });
   }
   
   

  return (
    <AccountContext.Provider
      value={{
        customer,
        retrievingCustomer,
        loginView,
        checkSession,
        refetchCustomer: refetch,
        handleLogout,
        state, close, open: openAndCancel, timedOpen
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}


export const useAccount = () => {
  const context = useContext(AccountContext)

  if (context === null) {
    throw new Error("useAccount must be used within a AccountProvider")
  }
  return context
}
