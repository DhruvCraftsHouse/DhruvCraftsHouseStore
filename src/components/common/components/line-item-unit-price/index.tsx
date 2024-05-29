import { getPercentageDiff } from "@/lib/util/get-precentage-diff";
import { LineItem, Region } from "@medusajs/medusa";
import clsx from "clsx";
import { formatAmount } from "@/lib/util/prices";
import { CalculatedVariant } from "@/types/medusa";

type LineItemUnitPriceProps = {
  item: Omit<LineItem, "beforeInsert">;
  region: Region;
  style?: "default" | "tight";
};

const LineItemUnitPrice = ({
  item,
  region,
  style = "default",
}: LineItemUnitPriceProps) => {
  const originalPrice = (item.variant as CalculatedVariant).original_price;
  const hasReducedPrice = (originalPrice * item.quantity || 0) > item.total!;
  const reducedPrice = (item.total || 0) / item.quantity!;
  const taxPerUnit = (item.tax_total || 0) / item.quantity!;

  const adjustedReducedPrice = reducedPrice - taxPerUnit;
  const adjustedUnitPrice = (item.unit_price || 0) - taxPerUnit;

  console.log("item", item);

  return (
    <div className="flex flex-col text-black justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-black">Original: </span>
            )}
            <span className="line-through">
              {formatAmount({
                amount: originalPrice,
                region: region,
                includeTaxes: false,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-black">
              -{getPercentageDiff(originalPrice, adjustedReducedPrice || 0)}%
            </span>
          )}
        </>
      )}
      <span
        className={clsx("text-base-regular", {
          "text-rose-700": hasReducedPrice,
        })}
      >
        {formatAmount({
          amount: adjustedReducedPrice || adjustedUnitPrice || 0,
          region: region,
          includeTaxes: false,
        })}
      </span>
    </div>
  );
};

export default LineItemUnitPrice;
