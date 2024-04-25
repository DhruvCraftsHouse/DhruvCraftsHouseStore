// import { Tab } from "@headlessui/react"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Back from "@/components/common/icons/back"
import FastDelivery from "@/components/common/icons/fast-delivery"
import Refresh from "@/components/common/icons/refresh"
// import { ProgressAccordion, Text } from "@medusajs/ui"
// import clsx from "clsx"
import { useMemo } from "react"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: PricedProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = useMemo(() => {
    return [
      {
        label: "Product Details",
        component: <ProductInfoTab product={product} />,
      },
      {
        label: "Shipping & Returns",
        component: <ShippingInfoTab />,
      },
    ]
  }, [product])

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
            style={{color:"#000"}}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {

  //included additional code to display the description as bullet points
  const subtitle = product.description || '';
  const subtitleLines = subtitle.split('\n');
  
  const formattedSubtitle = subtitleLines.map((line, index) => {
    if (line.trim() === "") {
      return null; // Skip blank lines
    }
    return (
      <li key={index} className="custom-dot-list-item" style={{ marginBottom: '18px', fontSize: '15px', fontWeight: 500, color: "rgba(0,0,0,1)", fontFamily: "Klein, sans-serif", display: 'flex' }}>
        <span style={{ marginRight: '13px' }}>&#x2022;</span>
        <div style={{ width: "95%" }}>{line}</div>
      </li>
    );
  });

  //changed returned display to display the description as bullet points
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-col gap-x-8">
        <div className="flex flex-col gap-y-4 pl-9" style={{ width: "100%" }}>
          <div>
            <ul className="custom-dot-list" style={{ paddingLeft: '50px', width: "100%" }}>
              {formattedSubtitle}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
