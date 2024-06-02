import { ProductVariant } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"

// Assuming this type aligns with the structure of an option in your product model
interface ProductOption {
  id: string;
  title?: string;
}

type LineItemOptionsProps = { variant: ProductVariant }

const LineItemOptions = ({ variant }: LineItemOptionsProps) => {
  return (
    <>
      {variant?.options?.map((option) => {
        const optionName =
          variant.product?.options?.find((opt: ProductOption) => opt.id === option.option_id)
            ?.title || "Option"
        return (
          <Text key={option.id} className="txt-medium text-ui-fg-subtle">
            {optionName}: {option.value}
          </Text>
        )
      })}
    </>
  )
}

export default LineItemOptions
