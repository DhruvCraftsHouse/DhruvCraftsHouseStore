import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import {  Text } from "@medusajs/ui"
import React from "react"

type ProductDescriptionProps = {
  product: PricedProduct
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  return (
    <div id="product-description" style={{textAlign:"left"}}>
      <div className=" flex flex-col gap-y-4 lg:max-w-[800px] ">
        {/* {product.collection && (
          <Link
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </Link>
        )} */}
        {/* <Heading level="h2" className="text-3xl leading-10 text-ui-fg-base">
          {product.title}
        </Heading> */}

        <Text className="text-medium text-ui-fg-subtle pl-3 custom-font" style={{fontWeight: 500,fontFamily:"Klein, sans-serif", fontSize:"22px",  color:"#000", lineHeight:"1.5em"}}>
          {product.subtitle}
        </Text>
      </div>
      <style>
        {`
        .custom-font {
          font-family: Klein Trial, sans-serif; /* Use the correct font name */
        }
        `}
      </style>
    </div>
  )
}

export default ProductDescription
