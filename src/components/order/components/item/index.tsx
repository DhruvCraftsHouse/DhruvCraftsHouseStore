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

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
}

const Item = ({ item, region }: ItemProps) => {

  const transformThumbnailUrl = (url: string | null): string => {
    if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
    return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
  };
  
  console.log('item.thumbnail', item.thumbnail)
  return (
    <Table.Row className="w-full">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="flex w-16">
          <Thumbnail thumbnail={transformThumbnailUrl(item.thumbnail)} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text className="txt-medium-plus text-ui-fg-base">{item.title}</Text>
        <LineItemOptions variant={item.variant} />
      </Table.Cell>

      <Table.Cell className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-ui-fg-muted">{item.quantity}x </Text>
            <LineItemUnitPrice item={item} region={region} style="tight" />
          </span>

          <LineItemPrice item={item} region={region} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
