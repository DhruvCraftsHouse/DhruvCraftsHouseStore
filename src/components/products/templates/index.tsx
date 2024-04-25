"use client"

import React, { useEffect, useRef, useState } from "react"
import { ProductProvider } from "@/lib/context/product-context"
import { useIntersection } from "@/lib/hooks/use-in-view"
import ProductInfo from "./product-info"
import ProductTabs from "../components/product-tabs"
// import RelatedProducts from "@modules/products/components/related-products"
import ImageGallery from "../components/image-gallery"
import MobileActions from "../components/mobile-actions"
import ProductOnboardingCta from "../components/product-onboarding-cta"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import ProductActions from "../components/product-actions"
//additional imports for customized addition of Ratings component 
import ProductDescription from "./product-description"
// import ReviewsRatings from "./ReviewsRatings"
import Medusa from "@medusajs/medusa-js"
import { MEDUSA_BACKEND_URL } from "@/lib/config"
import { Suspense } from "react"
import ReviewsRatings from "./ReviewsRatings"
import RelatedProducts from "@/components/products/components/related-products"



type ProductTemplateProps = {
  product: PricedProduct
}

//included the follwoing to immediately reflect the changes in admin panel
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });


const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false)

  const infoRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(infoRef, "0px")

  //useEffect in initial template of basic medusajs store
  // useEffect(() => {
  //   const onboarding = window.sessionStorage.getItem("onboarding")
  //   setIsOnboarding(onboarding === "true")
  // }, [])

  //additional state initialization to reflect the changes immediately with changes made in admin panel
  const [retrievedProduct, setRetrievedProduct] = useState<PricedProduct | null>(null);

  // console.log('product temp;ate', product)
  const productId: string = product.id!;

  useEffect(() => {
    if (!retrievedProduct || retrievedProduct.id !== productId) {
      medusa.products.retrieve(productId)
        .then(({ product }) => {
          setRetrievedProduct(product);
        })
        .catch(error => {
          console.error("Error fetching product details: ", error);
        });
    }
  }, [productId, retrievedProduct]);
  

  //additional code to customize the view of Review component 
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  //changed returned display according to our customized UI of displayed products and reviews
  return (
    <ProductProvider product={retrievedProduct || product}> {/* Use retrievedProduct if available */}
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative" >
        <div className="block w-full relative" style={{ width: "70%" }}>
        <ImageGallery images={retrievedProduct?.images || []} video={retrievedProduct?.video || ""} />
        </div>
        <div
          className="flex flex-col small:sticky small:top-28 small:py-0 small:max-w-[300px] w-full py-0 gap-y-2"
          ref={infoRef} 
        >
          <ProductInfo onReviewsClick={scrollToReviews} product={retrievedProduct || product} />
          {isOnboarding && <ProductOnboardingCta />}
          <ProductActions product={retrievedProduct || product} />
        </div>
      </div>
      <div className="content-container">
        <div className="mb-8 mt-8">
          {/* Product Description Component */}
          <ProductDescription product={retrievedProduct || product} />
        </div>
        <div className="mb-4 mt-5">
          {/* Increase the margin-bottom to create a gap */}
          <ProductTabs product={retrievedProduct || product} />
        </div>
      </div>
      <div className="content-container my-16 px-6 small:px-8 small:my-32">
      <Suspense fallback={<div>Loading...</div>}>
  <RelatedProducts product={retrievedProduct || product} />
  {/* <ReviewsRatings product={retrievedProduct || product} /> */}
</Suspense>

        {/* <RelatedProducts product={retrievedProduct || product} /> */}
      </div>
      <div ref={reviewsRef} className="content-container my-16 px-6 small:px-8 small:my-32">
      <Suspense fallback={<div>Loading...</div>}>
  {/* <RelatedProducts product={retrievedProduct || product} /> */}
  <ReviewsRatings product={retrievedProduct || product} />
</Suspense>

        {/* <ReviewsRatings product={retrievedProduct || product} /> */}
      </div>
      <MobileActions product={retrievedProduct || product} show={!inView} />
    </ProductProvider>
  )
}
export default ProductTemplate
