import {
    ProductProvider,
    useProductActions,
  } from "@/lib/context/product-context"
  import useProductPrice from "@/lib/hooks/use-product-price"
  import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
  import { Button } from "@medusajs/ui"
  import Divider from "@/components/common/components/divider"
  import OptionSelect from "@/components/products/components/option-select"
  import clsx from "clsx"
  import React, { useMemo, useState } from "react"
  import { StoreVariantsRes } from "@medusajs/medusa"
  
 // Update the WishlistProductProps type
type WishlistProductProps = {
    product: PricedProduct,
    variantArgu: StoreVariantsRes // Updated name
  };
  
  const WishlistProductInner: React.FC<WishlistProductProps> = ({ product, variantArgu }) => {

    const { updateOptions, addToCart, options, inStock, variant } = useProductActions();
  
    // Use the renamed prop variantArgu
    const localVariant = variantArgu;
    console.log('localVariant', localVariant);
    // const price = useProductPrice({ id: product.id!, variantId: localVariant?.id });
    console.log('updateOptions', updateOptions)
    // console.log("price ",price)
    // const selectedPrice = useMemo(() => {
    //   const { variantPrice, cheapestPrice } = price
  
    //   return variantPrice || cheapestPrice || null
    // }, [price])
  
    return (
      <div className="flex flex-col gap-y-2">
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              <Divider />
            </div>
          )}
        </div>
        <span>{product.title}</span>
        {/* {selectedPrice ? (
          <div className="flex flex-col text-ui-fg-base">
            <span
              className={clsx("text-xl-semi", {
                "text-ui-fg-interactive": selectedPrice.price_type === "sale",
              })}
            >
              {selectedPrice.calculated_price}
            </span>
            {selectedPrice.price_type === "sale" && (
              <>
                <p>
                  <span className="text-ui-fg-subtle">Original: </span>
                  <span className="line-through">
                    {selectedPrice.original_price}
                  </span>
                </p>
                <span className="text-ui-fg-interactive">
                  -{selectedPrice.percentage_diff}%
                </span>
              </>
            )}
          </div>
        ) : (
          <div></div>
        )} */}
  
        <Button
          onClick={addToCart}
          disabled={!inStock || !variant}
          variant="primary"
          className="w-full h-10"
        >
          {!inStock
            ? "Out of stock"
            : !variant
            ? "Select variant"
            : "Add to cart"}
        </Button>
      </div>
    )
  }
  
  const WishlistProduct: React.FC<WishlistProductProps> = ({ product, variantArgu }) => (
    <ProductProvider product={product}>
      <WishlistProductInner product={product} variantArgu={variantArgu} />
    </ProductProvider>
  );
   
   
  export default WishlistProduct
  