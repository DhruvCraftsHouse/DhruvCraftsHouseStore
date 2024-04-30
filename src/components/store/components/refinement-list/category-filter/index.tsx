import { StoreGetProductsParams } from "@medusajs/medusa"
import FilterRadioGroup from "@/components/common/components/filter-radio-group"
import { useCollections, useProductCategories } from "medusa-react"
import { ChangeEvent, useState } from "react"

type SortCategoryFilterProps = {
  refinementList: StoreGetProductsParams
  setRefinementList: (refinementList: StoreGetProductsParams) => void
}

const CategoryFilter = ({
  refinementList,
  setRefinementList,
}: SortCategoryFilterProps) => {
  const { product_categories } = useProductCategories()
  const [categoryId, setCategoryId] = useState<string | null>(null)

  if (!product_categories) {
    return null
  }

  console.log("product_categories ",product_categories)
  const categoryMap = product_categories?.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const handleCategoryChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setCategoryId(id)

    setRefinementList({
      ...refinementList,
      category_id: [id],
    })
  }

  return (
    <FilterRadioGroup
      title="Categories"
      items={categoryMap}
      value={categoryId}
      handleChange={handleCategoryChange}
    />
  )
}

export default CategoryFilter
