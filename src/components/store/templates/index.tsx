"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import InfiniteProducts from "@/components/products/components/infinite-products"
import RefinementList from "@/components/store/components/refinement-list"
import { useState } from "react"
import { SortOptions } from "../components/refinement-list/sort-products"

const StoreTemplate = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  const [sortBy, setSortBy] = useState<SortOptions>("created_at")


  console.log("params ",params)

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6">
      <RefinementList
        refinementList={params}
        setRefinementList={setParams}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <InfiniteProducts params={params} sortBy={sortBy} />
    </div>
  )
}

export default StoreTemplate
