import clsx from "clsx"
import Link from "next/link"
import { ProductPreviewType } from "@/types/global"
import Thumbnail from "../thumbnail"
import { Text } from "@medusajs/ui"
// Import the necessary Medusa client module
import Medusa from "@medusajs/medusa-js";
import { MEDUSA_BACKEND_URL } from "@/lib/config"
import { useState, useEffect } from "react"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

// Initialize the Medusa client
const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL, // Replace with your actual Medusa server URL
  maxRetries: 3,
});

// Function to fetch a product by ID
const getProductById = async (productId: string): Promise<PricedProduct> => {
  try {
    // Make the request to the Medusa server to fetch the product
    const response = await medusa.products.retrieve(productId);
    // The response object contains the product details
    // console.log("Product details:", response.product);
    return response.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error; // Rethrow the error for caller to handle
  }
};

const ProductPreview = ({
  id,
  title,
  handle,
  thumbnail,
  price,
  isFeatured,
  buy_get_num,
  buy_get_offer,
  discountCode,
  sales_quantity,
  video
}: ProductPreviewType) => {

  const [product, setProduct] = useState<PricedProduct | null>(null);

  useEffect(() => {
    if (id) { // Check if 'id' is not null or undefined
      getProductById(id) // Use 'id' to fetch product details
        .then(setProduct)
        .catch(error => console.error('Failed to load product', error));
    }
  }, [id]); // Depend on 'id', re-run this effect if 'id' changes

    // Helper function to convert the thumbnail URL
const convertThumbnailUrl = (url: string): string => {
  if (!url) return '';
  const baseUrl = 'https://dhruvcraftshouse.com/backend/uploads/';
  const filename = url.split('/').pop() || ''; // Ensure filename is not undefined
  return `${baseUrl}${filename}`;
};

// console.log('buy_get_num product-preview',title,' ',id,'id', product?.buy_get_num)
const thumbnailUrl = thumbnail ? convertThumbnailUrl(thumbnail) : '';
  return(
  <Link href={`/products/${handle}`} className="group">
    <div>
      <Thumbnail thumbnail={thumbnailUrl} size="square" isFeatured={isFeatured} />
      {product?.sales_quantity > 5 &&(
      <Text style={{color:"red", fontSize:"12px", fontWeight: 600}}>BESTSELLER</Text>
      )}
      <div className="flex txt-compact-medium mt-4 justify-between">

        <Text className="text-ui-fg-subtle">{title}</Text>

       
        <div className="flex items-center gap-x-2">
          {price ? (
            <>
              {price.price_type === "sale" && (
                <Text className="line-through text-ui-fg-muted">
                  {price.original_price}
                </Text>
              )}
              <Text
                className={clsx("text-ui-fg-muted", {
                  "text-ui-fg-interactive": price.price_type === "sale",
                })}
              >
                {price.calculated_price}
              </Text>
            </>
          ) : (
            <div className="w-20 h-6 animate-pulse bg-gray-100"></div>
          )}
        </div>
      </div>
      {/* {product?.discountCode && product?.buy_get_num && product?.buy_get_offer && (
          <div>
            <Text style={{color:"green", letterSpacing:"-0.05em"}}>
              Buy {product?.buy_get_num} Get {product?.buy_get_offer} % Offer using {product?.discountCode}
            </Text>
          </div>
        )} */}
        {product?.buy_get_num && product.buy_get_offer && (
  <div>
    <Text style={{color:"green", letterSpacing:"-0.05em"}}>
      Buy {product?.buy_get_num} Get {product.buy_get_offer} % Offer
      {product.discountCode ? ` using code ${product.discountCode}` : ''}
    </Text>
  </div>
)}

    </div>
  </Link>
)
}

export default ProductPreview
