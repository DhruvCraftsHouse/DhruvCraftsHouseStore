import { useStore } from "@/lib/context/store-context"
import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text, clx } from "@medusajs/ui"
import LineItemOptions from "@/components/common/components/line-item-options"
import LineItemPrice from "@/components/common/components/line-item-price"
import LineItemUnitPrice from "@/components/common/components/line-item-unit-price"
import CartItemSelect from "@/components/cart/components/cart-item-select"
import Trash from "@/components/common/icons/trash"
import Thumbnail from "@/components/products/components/thumbnail"
import Link from "next/link"
//include additional imports to include moveToWishlist button for cart items
import Wishlist from "@/components/common/icons/wishlist"
import { useState } from "react"
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context"
// import { getWishListItem } from './getWishListItem'
import { postToWishlist } from './postToWishlist'
import { getWishList } from "./getWishlist"
import Medusa from "@medusajs/medusa-js";
import { useAccount } from "@/lib/context/account-context"
import { MEDUSA_BACKEND_URL } from "@/lib/config"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
  type?: "full" | "preview"
}

//included additional types an interfaces for moveToWishlist button for cart items
type ListItem = {
  id: string | undefined
  variant_id: string | undefined
  size: string | undefined
  title: string | undefined
  thumbnail: string | null | undefined
  handle: string | null | undefined
}

 // Define interface for Wishlist items
 interface FavoriteItem {
  id: string;
  customer_id: string;
  variant_id: string;
  email: string;
  created_at: string;
  // Include other properties as needed
}

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });


const Item = ({ item, region, type = "full" }: ItemProps) => {
  const { updateItem, deleteItem } = useStore()
  const { handle } = item.variant.product
  //initialize states for moveToWishlist functionality for cart items
  const [isHovering, setIsHovering] = useState(false);
  const { customerId, setCustomerId,totalItems,setTotalItems} = useWishlistDropdownContext();
  const { listItems, setListItems } = useWishlistDropdownContext();


  const { customer } = useAccount();

  const getListItem = async (item: FavoriteItem): Promise<ListItem> => {
    const response = await medusa.products.variants.retrieve(item.variant_id);
    const variant = response.variant;

    return {
      id: item.id, // Generates a unique ID
      variant_id: variant.id,
      size: variant.title,
      title: variant.product?.title,
      thumbnail: variant.product?.thumbnail,
      handle: variant.product?.handle
    };
  };

  const moveToWishlist = async (id: any, itemId: any) => {
    // deleteItem(id);
    // console.log("id ",id);
    // console.log("customer id ",customer?.id);

    // Check if the user is not signed in
  if (!customer?.id) {
    // Show a prompt asking the user to sign in
    alert("Please sign in to remove items to your wishlist.");
    return;
  }

    postToWishlist(customer?.id, customer?.email, id)
    const response= await getWishList(customer?.id);
    // console.log("getWishlist at post ",response)
    setTotalItems(response.wishlist.length)

    if (response.wishlist && Array.isArray(response.wishlist)) {
      const wishlistPromises = response.wishlist.map(getListItem);
      const wishlistItems = await Promise.all(wishlistPromises);
      setListItems(wishlistItems);

      // console.log("listItems product ",listItems)
    }

    deleteItem(itemId)

   };
   
   const transformThumbnailUrl = (url: string | null): string => {
    if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
    return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
  };
  
  
   console.log('item.thumbnail', item.thumbnail)
//included returned display code with additional display of discounts and moveToWishlist button
   return (
    <Table.Row className="w-full">

      <Table.Cell className="!pl-0 p-4 w-24">
        <Link
          href={`/products/${handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail thumbnail={transformThumbnailUrl(item.thumbnail)} size="square" />
        </Link>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text className="txt-medium-plus text-ui-fg-base">{item.title}</Text>
        <LineItemOptions variant={item.variant} />
        {item.variant.product.buy_get_offer && (
           <Text className="txt-medium-plus text-ui-fg-base" style={{color:"green"}}>Buy {item.variant.product.buy_get_num} Get {item.variant.product.buy_get_offer}% off using code: &quot;{item.variant.product.discountCode}&quot;</Text>
        )}


      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2">
          

            <CartItemSelect
              value={item.quantity}
              onChange={(value) =>
                updateItem({
                  lineId: item.id,
                  quantity: parseInt(value.target.value),
                })
              }
              className="w-14 h-10 p-4"
            >
              {Array.from(
                [
                  ...Array(
                    item.variant.inventory_quantity > 0
                      ? item.variant.inventory_quantity
                      : 10
                  ),
                ].keys()
              )
                .slice(0, 10)
                .map((i) => {
                  const value = i + 1
                  return (
                    <option value={value} key={i}>
                      {value}
                    </option>
                  )
                })}
            </CartItemSelect>
            <button
              className="flex items-center gap-x-"
              onClick={() => deleteItem(item.id)}
            >
              <Trash size={18} /> 
              
            </button>
            <button
 className="flex items-center gap-x-"
 title="Move to wishlist"
 onClick={() => moveToWishlist(item.variant_id, item.id)}

>
 <Wishlist fill=""/>
</button>
          </div>
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice item={item} region={region} style="tight" />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice item={item} region={region} style="tight" />
            </span>
          )}
          <LineItemPrice item={item} region={region} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
