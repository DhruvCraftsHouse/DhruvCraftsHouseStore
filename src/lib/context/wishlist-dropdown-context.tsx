"use client";

import React, { createContext, useContext, Dispatch, SetStateAction, useState, useEffect, ReactNode } from "react";
import useToggleState from "@/lib/hooks/use-toggle-state"
import { useMeCustomer } from "medusa-react";

interface WishlistDropdownContext {
    state: boolean
    open: () => void
    timedOpen: () => void
    close: () => void
}

type ListItem = {
    id: string | undefined
    variant_id: string | undefined
    size: string | undefined
    title: string | undefined
    thumbnail: string | null | undefined
    handle: string | null | undefined
}

interface ContextProps {
    customerId: string,
    setCustomerId: Dispatch<SetStateAction<string>>,
    totalItems: number,
    setTotalItems: Dispatch<SetStateAction<number>>,
    totalCartItems: number,
    setTotalCartItems: Dispatch<SetStateAction<number>>,
    listItems: ListItem[];
    setListItems: Dispatch<SetStateAction<ListItem[]>>;
    state: boolean
    open: () => void
    timedOpen: () => void
    close: () => void
}

const WishlistDropdownContext = createContext<ContextProps>({
    customerId: '',
    setCustomerId: (): string => '',
    totalItems: 0,
    setTotalItems: (): number => 0,
    totalCartItems: 0,
    setTotalCartItems: (): number => 0,
    listItems: [],
    setListItems: () => [],
    state: false,
    open: () => { },
    timedOpen: () => { },
    close: () => { }
})


export const WishlistDropdownContextProvider = ({ children }: { children: ReactNode }) => {
    const [customerId, setCustomerId] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [totalCartItems, setTotalCartItems] = useState(0);
    const [listItems, setListItems] = useState<ListItem[]>([]);

    const { state, close, open } = useToggleState()

    const { customer } = useMeCustomer();

    const [activeTimer, setActiveTimer] = useState<number | undefined>(undefined);

    const timedOpen = () => {
        open()

        const timer = window.setTimeout(() => {
            close();
        }, 5000);
        
        setActiveTimer(timer)
    }

    const openAndCancel = () => {
        if (activeTimer) {
            clearTimeout(activeTimer)
        }

        open()
    }

    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer)
            }
        }
    }, [activeTimer])

    return (
        <WishlistDropdownContext.Provider value={{
            customerId, setCustomerId, totalItems, setTotalItems, totalCartItems, setTotalCartItems, listItems,
            setListItems, state, close, open: openAndCancel, timedOpen
        }}>
            {children}
        </WishlistDropdownContext.Provider>
    )
}

export const useWishlistDropdownContext = () => useContext(WishlistDropdownContext);
