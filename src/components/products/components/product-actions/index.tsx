import {
  ProductProvider,
  useProductActions,
} from "@/lib/context/product-context";
import useProductPrice from "@/lib/hooks/use-product-price";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { Button } from "@medusajs/ui";
import Divider from "@/components/common/components/divider";
import OptionSelect from "@/components/products/components/option-select";
import clsx from "clsx";
// Additional imports to include addToWishlist feature, discount display feature, and product category feature
import React, { useMemo, useState, useEffect } from "react";
import Wishlist from "../../../common/icons/wishlist";
import { getWishListItem } from "./getWishListItem";
import { postToWishlist } from "./postToWishlist";
import { useRouter } from "next/navigation";
import SignInPrompt from "../sign-in-prompt";
import { getWishList } from "./getWishlist";
import { useCart, useMeCustomer } from "medusa-react";
import { useWishlistDropdownContext } from "@/lib/context/wishlist-dropdown-context";
import { useStore } from "@/lib/context/store-context";
import Medusa from "@medusajs/medusa-js";
import { useProductCategories } from "medusa-react";
import axios from "axios";
import { getDiscountList } from "./productDiscount";
import { MEDUSA_BACKEND_URL } from "@/lib/config";

type ProductActionsProps = {
  product: PricedProduct;
  onVariantChange?: (variant: any) => void; // Make onVariantChange optional
};

type ProductActionsInnerProps = {
  product: PricedProduct;
  onVariantChange: (variant: any) => void;
};

type WishlistProps = {
  fill: string;
};

interface FavoriteItem {
  id: string;
  customer_id: string;
  variant_id: string;
  email: string;
  created_at: string;
}

type WishlistItem = {
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
};

type ListItem = {
  id: string | undefined;
  variant_id: string | undefined;
  size: string | undefined;
  title: string | undefined;
  thumbnail: string | null | undefined;
  handle: string | null | undefined;
};

type CategoryWithProducts = {
  id: string;
  name: string;
  handle: string;
  productIds: string[];
};

type AncestorCategory = {
  id: string;
  name: string;
  handle: string;
};

interface Discount {
  value: number;
  type: string;
  code: string;
}

type DiscountsArray = Discount[];

function generateId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}-${randomNum}`;
}

const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

const ProductActionsInner: React.FC<ProductActionsInnerProps> = ({ product, onVariantChange }) => {
  const { updateOptions, addToCart, options, inStock, variant } = useProductActions();
  const price = useProductPrice({ id: product.id!, variantId: variant?.id });
  const selectedPrice = useMemo(() => {
    const { variantPrice, cheapestPrice } = price;
    return variantPrice || cheapestPrice || null;
  }, [price]);

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const { customerId, setCustomerId, totalItems, setTotalItems } = useWishlistDropdownContext();
  const { customer } = useMeCustomer();
  const { deleteItem } = useStore();
  const variantId = variant?.id;
  const inWishlist = getWishListItem(customerId, variantId);
  const [buyGetNumber, setBuyGetNumber] = useState<number | null>(null);
  const [buyGetOffer, setBuyGetOffer] = useState<number | null>(null);
  const [salesQuantity, setSalesQuantity] = useState<number | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { listItems, setListItems } = useWishlistDropdownContext();
  const productId: string = product.id!;

  useEffect(() => {
    medusa.products.retrieve(productId)
      .then(({ product }) => {
        setBuyGetNumber(product?.buy_get_num || null);
        setBuyGetOffer(product?.buy_get_offer || null);
        setSalesQuantity(product?.sales_quantity || null);
        setDiscountCode(product.discountCode || null);
      })
      .catch(error => {
        console.error("Error fetching product details: ", error);
      });
  }, []);

  useEffect(() => {
    onVariantChange(variant);
  }, [variant]);

  const checkWishlist = async () => {
    const inWishlist = await getWishListItem(customer?.id, variant?.id);
    setIsInWishlist(inWishlist || false);
  };

  if (customer?.id && variant?.id) {
    checkWishlist();
  }

  const getListItem = async (item: FavoriteItem): Promise<ListItem> => {
    const response = await medusa.products.variants.retrieve(item.variant_id);
    const variant = response.variant;
    return {
      id: item.id,
      variant_id: variant.id,
      size: variant.title,
      title: variant.product?.title,
      thumbnail: variant.product?.thumbnail,
      handle: variant.product?.handle,
    };
  };

  const handleAddToWishlist = async () => {
    if (!customer?.id) {
      setShowSignInPrompt(true);
      return;
    }
    postToWishlist(customer?.id, customer?.email, variant?.id);
    const response = await getWishList(customer?.id);
    setIsInWishlist(!isInWishlist);
    setMessage(isInWishlist ? 'Remove from wishlist' : 'Add to wishlist');
    setTotalItems(response.wishlist.length);
    if (response.wishlist && Array.isArray(response.wishlist)) {
      const wishlistPromises = response.wishlist.map(getListItem);
      const wishlistItems = await Promise.all(wishlistPromises);
      setListItems(wishlistItems);
    }
  };

  const handleData = async () => {
    try {
      const response = await getWishList(customer?.id);
      return response || { wishlist: [] };
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return { wishlist: [] };
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchWishlist = async () => {
      const data = await handleData();
      if (data?.wishlist && Array.isArray(data.wishlist)) {
        data.wishlist.forEach((item: FavoriteItem) => {
          medusa.products.variants.retrieve(item.variant_id)
            .then(({ variant }) => {
              if (isCancelled) return;
              setWishlistItems((prevItems) => {
                const itemExists = prevItems.some((prevItem) => prevItem.id === item.id);
                if (itemExists) {
                  return prevItems;
                } else {
                  return [
                    ...prevItems,
                    {
                      id: item.id,
                      variant_id: variant.id,
                      size: variant.title,
                      title: variant.product?.title,
                      thumbnail: variant.product?.thumbnail,
                      handle: variant.product?.handle,
                    },
                  ];
                }
              });
            })
            .catch((error) => console.error("Error fetching variant details:", error));
        });
      } else {
        console.log("Wishlist data is not in expected format:", data);
      }
    };
    fetchWishlist();
    return () => {
      isCancelled = true;
    };
  }, [customer?.id]);

  const [quantity, setQuantity] = useState<number | undefined>(undefined);

  medusa.products.variants.list().then(({ variants }) => {
    const variant = variants.find((variant) => variant.product_id === product.id);
    if (variant) {
      setQuantity(variant.inventory_quantity);
    }
  });

  const { cart } = useCart();
  const isInCart = (cart?.items.some((item) => item.variant_id === variant?.id)) ?? false;
  const deleteCartItem = (variantId: any) => {
    const itemToDelete = cart?.items.find((item) => item.variant_id === variant?.id);
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
    }
  };

  const inventory_quantity = variant?.inventory_quantity;

  const variantOptionValues = variant?.options.map((variantOption) => {
    const productOption = product.options?.find((option) => option.id === variantOption.option_id);
    if (!productOption) {
      return null;
    }
    return {
      ...productOption,
      selectedValue: variantOption.value,
    };
  }).filter((option) => option !== null);

  const [matchingCategoryId, setMatchingCategoryId] = useState<string | null>(null);
  const { product_categories } = useProductCategories();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);

  useEffect(() => {
    const fetchProductsForCategories = async () => {
      if (product_categories) {
        const categoriesData = await Promise.all(
          product_categories.map(async (category) => {
            try {
              const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products?category_id[]=${category.id}`);
              const productIds = response.data.products.map((product: PricedProduct) => product.id);
              return {
                id: category.id,
                name: category.name,
                productIds: productIds,
              };
            } catch (error) {
              console.error('Error fetching products for category:', error);
              return null;
            }
          })
        );
        setCategoriesWithProducts(categoriesData.filter((category): category is CategoryWithProducts => category !== null));
      }
    };
    fetchProductsForCategories();
  }, [product_categories]);

  useEffect(() => {
    if (productId) {
      const matchingCategory = categoriesWithProducts.find((category) =>
        category.productIds.includes(productId)
      );
      if (matchingCategory) {
        setMatchingCategoryId(matchingCategory.id);
      } else {
        setMatchingCategoryId(null);
      }
    }
  }, [categoriesWithProducts, productId]);

  const [ancestorCategories, setAncestorCategories] = useState<string[]>([]);
  const [fullAncestorCategories, setFullAncestorCategories] = useState<AncestorCategory[]>([]);

  const fetchAncestorCategories = async (
    categoryId: string,
    accumulatedCategories: AncestorCategory[] = []
  ): Promise<AncestorCategory[]> => {
    try {
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${categoryId}`);
      const categoryData = response.data.product_category;
      const currentCategory: AncestorCategory = {
        id: categoryData.id,
        name: categoryData.name,
        handle: categoryData.handle,
      };
      accumulatedCategories.unshift(currentCategory);
      if (categoryData.parent_category) {
        return fetchAncestorCategories(categoryData.parent_category.id, accumulatedCategories);
      }
      return accumulatedCategories;
    } catch (error) {
      console.error('Error fetching ancestor categories:', error);
      return accumulatedCategories;
    }
  };

  const capitalizeWords = (str: string): string => {
    return str.split('').map((char, index, arr) => {
      if (index === 0 || !arr[index - 1].match(/[a-zA-Z]/)) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    }).join('');
  };

  const removeOldAncestorName = (
    categories: AncestorCategory[],
    oldAncestorName: string
  ): AncestorCategory[] => {
    return categories.map((category, index) => {
      if (index === 0) {
        return category;
      }
      return {
        ...category,
        name: category.name.replace(new RegExp(`\\b${oldAncestorName}\\b`, 'gi'), '').trim(),
      };
    });
  };

  useEffect(() => {
    if (matchingCategoryId) {
      fetchAncestorCategories(matchingCategoryId).then((ancestors) => {
        if (ancestors.length > 0) {
          const oldAncestorName = ancestors[0].name;
          const updatedAncestors = removeOldAncestorName(ancestors, oldAncestorName);
          setFullAncestorCategories(updatedAncestors);
        }
      });
    }
  }, [matchingCategoryId]);

  const recentCategory = fullAncestorCategories[fullAncestorCategories.length - 1]?.name || '';

  const [discounts, setDiscounts] = useState<DiscountsArray>([]);

  const fetchDiscounts = async () => {
    try {
      const discountsResponse = await getDiscountList(productId);
      setDiscounts(discountsResponse);
    } catch (error) {
      console.error("Error fetching discounts: ", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const renderDiscounts = () => {
    if (!discounts || discounts.length === 0) {
      return null;
    }
    const firstDiscount = discounts[0];
    if (!firstDiscount) {
      return null;
    }
    return (
      <div>
        <p style={{ fontSize: "14px", color: "#D7373D" }}>
          Extra {firstDiscount.value}{firstDiscount.type} off with code: {firstDiscount.code}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-2">
      {showSignInPrompt && <SignInPrompt />}
      {renderDiscounts()}
      {salesQuantity && salesQuantity > 5 && (
        <p className="mt-1" style={{ color: "red", fontSize: "14px", fontWeight: 600 }}>BESTSELLER</p>
      )}
      <div className="mb-1">
        {selectedPrice ? (
          <div className="flex flex-col text-ui-fg-base">
            {selectedPrice.price_type !== "sale" && (
              <p>
                <span className="text-xl-semi text-black">
                  {selectedPrice.calculated_price}
                </span>
                <span className="pt-1 pl-2" style={{ fontWeight: 400, color: "#666666", fontSize: "14px" }}>
                  Price excl. VAT
                </span>
              </p>
            )}
            {selectedPrice.price_type === "sale" ? (
              <>
                <p>
                  <span className="line-through text-black pl-1" style={{ fontSize: "18px", fontWeight: 500 }}>
                    {selectedPrice.original_price}
                  </span>
                  <span className={clsx("text-xl-semi", { "text-red pl-1": selectedPrice.price_type === "sale" })} style={{ fontSize: "20px" }}>
                    {selectedPrice.calculated_price}
                  </span>
                  <span className="pt-1 pl-2" style={{ fontWeight: 400, color: "#666666", fontSize: "14px" }}>
                    Price excl. VAT
                  </span>
                </p>
                <p style={{ background: "transparent" }}>
                  <span style={{
                    display: "inline-block",
                    background: "black",
                    color: "white",
                    padding: "1% 3%",
                    fontSize: "15px",
                    lineHeight: "24px",
                    textAlign: "center",
                    fontWeight: 500,
                    marginTop: "10px",
                  }}>
                    SALE -{selectedPrice.percentage_diff}%
                  </span>
                  {recentCategory && (
                    <span style={{
                      display: "inline-block",
                      marginLeft: "6%",
                      background: "black",
                      color: "white",
                      padding: "1% 3%",
                      fontSize: "14px",
                      lineHeight: "24px",
                      textAlign: "center",
                      fontWeight: 700,
                      marginTop: "10px",
                    }}>
                      {recentCategory}
                    </span>
                  )}
                </p>
              </>
            ) : (
              <p style={{ background: "transparent" }}>
                {recentCategory && (
                  <span style={{
                    display: "inline-block",
                    background: "black",
                    color: "white",
                    padding: "1% 3%",
                    fontSize: "15px",
                    lineHeight: "24px",
                    textAlign: "center",
                    fontWeight: 700,
                    marginTop: "10px",
                  }}>
                    {recentCategory}
                  </span>
                )}
              </p>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {buyGetNumber && buyGetOffer && (
        <div>
          <p style={{ color: "green", letterSpacing: "-0.05em" }}>
            Buy {buyGetNumber} Get {buyGetOffer} % Offer
            {discountCode ? ` using code ${discountCode}` : ''}
          </p>
        </div>
      )}
      {variant && inventory_quantity !== undefined ? (
        inventory_quantity < 8 ? (
          <p className="flex items-center gap-x-2" style={{ color: "red", fontSize: "15px" }}>
            Only {inventory_quantity} left in Stock
          </p>
        ) : (
          <p className="flex items-center gap-x-2" style={{ color: "#696969", fontSize: "15px" }}>
            In Stock
          </p>
        )
      ) : null}
      <div>
        {product.variants.length > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={updateOptions}
                  title={option.title}
                />
              </div>
            ))}
            <Divider />
          </div>
        )}
      </div>
      <Button
        onClick={() => {
          if (isInCart) {
            deleteCartItem(variant?.id);
          } else {
            addToCart();
          }
        }}
        disabled={!product.is_giftcard && (!inStock || !variant || isInWishlist)}
        variant="primary"
        className={clsx(
          "w-full h-10",
          {
            "mustard-yellow": isInCart,
            "other-color": !isInCart,
          }
        )}
        title={isInCart ? "Click to delete item from cart" : ""}
        style={{ borderRadius: "0px", fontSize: "16px", textTransform: "uppercase" }}
      >
        {!product.is_giftcard && !inStock
          ? "Out of stock"
          : !variant
            ? "Select variant"
            : isInCart
              ? "Already in cart"
              : "Add to cart"}
      </Button>
      <Button
        onClick={handleAddToWishlist}
        disabled={!inStock || !variant}
        variant="secondary"
        className="w-full h-10"
        style={{ borderRadius: "0px", fontSize: "16px", textTransform: "uppercase", background: "#F6F6F6" }}
      >
        {!inStock
          ? "Out of stock"
          : !variant
            ? "Select variant"
            : (
              <>
                {isInWishlist ? (
                  <>
                    <Wishlist fill="red" />  Remove from Wishlist
                  </>
                ) : (
                  <>
                    <Wishlist fill="" /> Add to Wishlist
                  </>
                )}
              </>
            )}
      </Button>
      <style>{`
        .mustard-yellow {
          background-color: #FF9800;
        }
        .text-red {
          color: RGB(181, 31, 41);
        }
      `}</style>
    </div>
  );
};

const ProductActions: React.FC<ProductActionsProps> = ({ product, onVariantChange = () => {} }) => (
  <ProductProvider product={product}>
    <ProductActionsInner product={product} onVariantChange={onVariantChange} />
  </ProductProvider>
);

export default ProductActions;
