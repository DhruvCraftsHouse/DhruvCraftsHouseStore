"use client"

import usePreviews from "@/lib/hooks/use-previews"
import {
  ProductCategoryWithChildren,
  getProductsByCategoryHandle,
} from "@/lib/data"
import getNumberOfSkeletons from "@/lib/util/get-number-of-skeletons"
import repeat from "@/lib/util/repeat"
import ProductPreview from "@/components/products/components/product-preview"
import SkeletonProductPreview from "@/components/skeletons/components/skeleton-product-preview"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useCart } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import UnderlineLink from "@/components/common/components/interactive-link"
import { notFound } from "next/navigation"
import axios from 'axios'
import Medusa from "@medusajs/medusa-js"
import { useProducts } from "medusa-react"
import { useProductCategories } from "medusa-react"
import { ProductCategory } from "@medusajs/medusa"
import Thumbnail from "@/components/products/components/thumbnail"
import { Text } from "@medusajs/ui"
import useProductPrice from "@/lib/hooks/use-product-price"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { ProductWithPrice } from "../ProductWithPrice"
import { Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faFilter, faTimes, faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@medusajs/ui"
import { Label } from "@medusajs/ui"
import TextField from '@mui/material/TextField';
import { ProductVariant, ProductOption } from "@medusajs/medusa" 
import { ProductOptionValue } from "@medusajs/medusa"
import "./Categories.css"; // Update with the correct file path
import { MEDUSA_BACKEND_URL } from "@/lib/config"

interface Category {
  id: string | number;
  name: string;
  handle: string;
  parent_category_id: string | number | null;
  category_children?: Category[];
  parent_category?: {
    id: string | number;
    name: string;
    parent_category_id: string | number | null;

    // ... other properties of parent_category
  } | null; // Making parent_category optional and nullable
}


type ProductDetail = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  variants: ProductVariant;
  isFeatured: boolean;
  buy_get_num: number;
  buy_get_offer: number;
  sales_quantity: number;
  options: ProductOption[]; // Change 'ProductOption' to 'ProductOption[]'

};



type CategoryTemplateProps = {
  categories: ProductCategoryWithChildren[]
}

type CategoryImagesType = {
  [key: string]: string;
};

// Type definitions for clarity
type CategoryId = string | number;

type CategoryWithChildren = {
  name: string;
  handle: string;
  category_children?: CategoryWithChildren[];
};
type ParentCategory = {
  name: string;
  // ...other properties
};

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str: string): string => {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a: string) {
    return a.toUpperCase();
  });
};

const fetchAllChildCategoryIds = async (categoryId: CategoryId): Promise<CategoryId[]> => {
  let categoryIds: CategoryId[] = [];

  const fetchCategoryIdsRecursive = async (id: CategoryId) => {
    categoryIds.push(id);

    const categoryResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${id}`);
    const childCategories = categoryResponse.data.product_category.category_children || [];

    for (const childCategory of childCategories) {
      await fetchCategoryIdsRecursive(childCategory.id);
    }
  };

  await fetchCategoryIdsRecursive(categoryId);
  return categoryIds;
};



const CategoryTemplate: React.FC<CategoryTemplateProps> = ({ categories }) => {
  const { cart } = useCart()
  const { ref, inView } = useInView()

  const { product_categories } = useProductCategories()


  const printParentCategories = () => {
    if (!product_categories) {
      console.log("No categories available");
      return;
    }

    const parentCategories = product_categories.filter(c => !c.parent_category);

  }

  printParentCategories();
  const parentCategories: ParentCategory[] = product_categories?.filter(c => !c.parent_category) || [];




  const modifyNames = (names: string[]): string[] => {
    return names.map(name => {
      let modifiedName = name;
      parentCategories.forEach(parentCategory => {
        const regex = new RegExp(`\\b${parentCategory.name}\\b`, 'i');
        modifiedName = modifiedName.replace(regex, '').trim();
      });
      return modifiedName;
    });
  };


  const [allCategoryIds, setAllCategoryIds] = useState<CategoryId[]>([]);

  useEffect(() => {
    if (categories) {
      categories.forEach(category => {
        fetchAllChildCategoryIds(category.id).then(categoryIds => {
          setAllCategoryIds(prevIds => Array.from(new Set([...prevIds, ...categoryIds])));
        });
      });
    }
  }, [categories]);

  // const category = categories[categories.length - 1]
  const parents = categories.slice(0, categories.length - 1)

  // Ensure 'category' is used after it's defined in the categories array
  const category: ProductCategoryWithChildren = categories[categories.length - 1];
  const modifiedCategoryName = category ? capitalizeWords(modifyNames([category.name])[0]) : '';
  const modifiedChildrenNames = modifyNames(category.category_children?.map(child => child.name) || []).map(name => capitalizeWords(name));

  // console.log("categories modified",categories)


  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);

  // State to store image URLs
  const [categoryImages, setCategoryImages] = useState<CategoryImagesType>({});
  //  console.log("categories tenplate ",categories)

  const fetchCategoryImage = async (categoryId: string) => {
    try {
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/categoryImage`, {
        params: { category_id: categoryId }
      });

      // Check if response and data are available and valid
      if (response && response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const categoryImageInfo = response.data.data[0];

        // Set the image URL in the state
        setCategoryImages(prevImages => ({
          ...prevImages,
          [categoryId]: categoryImageInfo.categorythumbnail
        }));
      } else {
        // Handle the scenario where data is not in the expected format or empty
        console.log(`No image data found for category ID: ${categoryId}`);
        // Optionally, you can set a default image or handle the absence of an image differently here
      }
    } catch (error) {
      console.error(`Error fetching category image for category ID: ${categoryId}:`, error);
      // Handle errors, like network issues or server problems
      // Optionally, you can set a default image or handle the error case differently here
    }
  };



  useEffect(() => {
    // Fetch image for the first category in the array
    if (categories.length > 0 && typeof categories[0].id === 'string') {
      fetchCategoryImage(categories[0].id);
    }

    // Fetch images for category children
    if (category && category.category_children) {
      category.category_children.forEach(child => {
        if (typeof child.id === 'string') {
          fetchCategoryImage(child.id);
        }
      });
    }
  }, [category, categories]);



  if (!category) notFound()

  const {
    data: infiniteData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    [`get_category_products`, category.handle, cart?.id],
    ({ pageParam }) =>
      getProductsByCategoryHandle({
        pageParam,
        handle: category.handle!,
        cartId: cart?.id,
        currencyCode: cart?.region?.currency_code,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )


  useEffect(() => {
    if (cart?.region_id) {
      refetch()
    }
  }, [cart?.region_id, refetch])

  const previews = usePreviews({
    pages: infiniteData?.pages,
    region: cart?.region,
  })

  // console.log('infiniteData', infiniteData)
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  // console.log("parent categories ",categories[0])
  // console.log('previews category', previews)

  type ProductId = string; // Assuming product IDs are strings

  const fetchAllChildCategoryProductIds = async (categoryId: string | number): Promise<ProductId[]> => {
    let productIds: ProductId[] = [];

    const fetchProductIdsForCategory = async (id: string | number): Promise<ProductId[]> => {
      try {
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products?category_id[]=${id}`);
        const products = response.data.products;
        // console.log('products categories', products)
        return products.map((product: { id: ProductId }) => product.id);
      } catch (error) {
        console.error('Error fetching product IDs:', error);
        return [];
      }
    };

    const fetchProductIdsRecursive = async (id: string | number) => {
      const ids = await fetchProductIdsForCategory(id);
      productIds.push(...ids);

      const categoryResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${id}`);
      // console.log("categoryResponse ",categoryResponse)
      const childCategories = categoryResponse.data.product_category.category_children || [];

      // console.log('childCategories', childCategories)
      for (const childCategory of childCategories) {
        await fetchProductIdsRecursive(childCategory.id);
      }
    };

    await fetchProductIdsRecursive(categoryId);
    return productIds;
  };

  useEffect(() => {
    categories.forEach(category => {
      fetchAllChildCategoryProductIds(category.id).then(async (productIds) => {
        const newProductDetails = await Promise.all(
          productIds.map(id => fetchProductDetailsById(id))
        );

        setProductDetails(prevDetails => {
          const updatedDetails = new Map(prevDetails.map(pd => [pd.id, pd]));
          newProductDetails.forEach(pd => {
            if (pd && !updatedDetails.has(pd.id)) {
              updatedDetails.set(pd.id, pd);
            }
          });
          return Array.from(updatedDetails.values());
        });
      });
    });
  }, [categories]);

  const fetchProductDetailsById = async (productId: string): Promise<ProductDetail | null> => {
    try {
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products/${productId}`);
      const product = response.data.product;

      // console.log("product at category ",product)
      // Extracting price from the first variant's first price
      let priceProduct = 0;
      if (product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0) {
        priceProduct = product.variants[0].prices[0].amount;
      }

      const transformThumbnailUrl = (url: string | null): string => {
        if (!url) return '/default-thumbnail.jpg'; // Return a default image URL if no URL is provided
        return url.replace("http://localhost:9000/uploads", "https://dhruvcraftshouse.com/backend/uploads");
      };
      // console.log('priceProduct', priceProduct)

      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: transformThumbnailUrl(product.thumbnail),
        variants: product.variants,
        created_at: product.created_at,
        updated_at: product.updated_at,
        price: priceProduct, // Assuming the amount is in cents
        isFeatured: product.isFeatured, // Replace with actual field name if available
        buy_get_num: product.buy_get_num,
        buy_get_offer: product.buy_get_offer,
        sales_quantity: product.sales_quantity,
        options: product.options
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  // console.log('productDetails', productDetails)
  // States for filtering and sorting
  const [filteredProducts, setFilteredProducts] = useState<ProductDetail[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [showPriceFilter, setShowPriceFilter] = useState<boolean>(false);
  const [colorFilter, setColorFilter] = useState('');
  // New state for managing the dropdown menu for the filter button
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const isFilterMenuOpen = Boolean(filterAnchorEl);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [showColorCheckboxes, setShowColorCheckboxes] = useState(false);
  const [showSizeCheckboxes, setShowSizeCheckboxes] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<{id: string | number, name: string}[]>([]);
  const [showCategoriesCheckboxes, setShowCategoriesCheckboxes] = useState(false);
  const [showPriceCheckboxes, setShowPriceCheckboxes] = useState(false);


  const handleCategoryChange = (category: {id: string | number, name: string}) => {
    setSelectedCategories(prev => {
      const isCategorySelected = prev.find(c => c.id === category.id);
      if (isCategorySelected) {
        // Remove the category if it is already selected
        return prev.filter(c => c.id !== category.id);
      } else {
        // Add the category if it is not selected
        return [...prev, category];
      }
    });
  };

  const getProductIdsForCategory = async (categoryId: string | number): Promise<string[]> => {
    try {
      // console.log('categoryId at getProductIdsForCategory', categoryId)
      const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/products?category_id[]=${categoryId}`);
      // console.log('response getProductIdsForCategory', response)
      return response.data.products.map((product: { id: string }) => product.id);
    } catch (error) {
      console.error('Error fetching product IDs for category:', error);
      return [];
    }
  };
  
  
  const handleFilterMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // State for the sorting dropdown
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleSortMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement);
  };


  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

   

  // Handle click event for the filter button
  const handleFilterClick = () => {
    setShowPriceFilter(true);

    setIsFilterSidebarOpen(!isFilterSidebarOpen);

    let filteredPriceData = productDetails;

    if (minPrice !== '' && maxPrice !== '') {
      filteredPriceData = filteredProducts.filter((item) => {
        // Convert calculatedPrice to string if it's a number
        const calculatedPrice = item.price / 100; // Assuming the price is in cents
        const priceAsString = calculatedPrice.toString();

        const price = parseFloat(priceAsString);
        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredProducts(filteredPriceData);
  };

  const handleClearFilters = () => {
    // console.log('productDetails clear', productDetails)
    setMinPrice('');
    setMaxPrice('');
    setColorFilter('');
    setSelectedColors(new Set()); // Reset selected colors
    setSelectedSizes(new Set()); // Reset selected sizes
    setSelectedCategories([]); // Clear selected categories
    setIsFilterSidebarOpen(false);
    setFilteredProducts(productDetails);
    // console.log('filteredProducts clear', filteredProducts)
  };
  
  
  const sortBySales = () => {
    const sortedData = [...productDetails].map(product => {
      // Ensure variants is treated as an array and calculate total sold quantity
      const totalSoldQuantity = Array.isArray(product.variants) ? product.variants.reduce((total: number, variant: { sales_quantity: number }) => {
        return total + (variant.sales_quantity || 0);
      }, 0) : 0;

      // console.log("title ",product.title," sold ",totalSoldQuantity)
      return { ...product, totalSoldQuantity };
    }).sort((a, b) => {
      // Sort in descending order of total sold quantity
      return b.totalSoldQuantity - a.totalSoldQuantity;
    });

    // Update the state to re-render the list
    setFilteredProducts(sortedData);
    handleSortMenuClose();

  };



  // Handle click event for clearing the filter
  const handleClearClick = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(productDetails);
    setShowPriceFilter(false);
  };

  // Add a function to sort by latest arrivals
  const sortByLatestArrivals = () => {
    const sortedData = [...filteredProducts].sort((a, b) => {
      // Use a default date (e.g., very old date) if updated_at is undefined
      const defaultDate = new Date(0); // Unix epoch start, or any other default date

      // Check if updated_at is defined, otherwise use defaultDate
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : defaultDate.getTime();
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : defaultDate.getTime();

      // Sort in descending order
      return dateB - dateA;
    });

    setFilteredProducts(sortedData);
    handleSortMenuClose();

  };

  const sortByHighestPrice = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      // Directly use the price for comparison
      const priceA = a.price || 0;
      const priceB = b.price || 0;

      return priceB - priceA;
    });
    setFilteredProducts(sorted);
    handleSortMenuClose();
  };

  const sortByLowestPrice = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      // Directly use the price for comparison
      const priceA = a.price || 0;
      const priceB = b.price || 0;

      return priceA - priceB;
    });
    setFilteredProducts(sorted);
    handleSortMenuClose();
  };

  // Apply filter when filter criteria changes
 // Apply filter when filter criteria or selected colors change
 useEffect(() => {
  handleApplyFilter();
}, [minPrice, maxPrice, sortCriteria, colorFilter, selectedColors, selectedSizes, selectedCategories, productDetails]);

  

  // console.log('filteredProducts', filteredProducts)
  // console.log('categories', categories)

  // Find the current category, which is the last one in the array
  const currentCategory: ProductCategoryWithChildren = categories[categories.length - 1];
  const hasChildren = currentCategory.category_children && currentCategory.category_children.length > 0;
  const parentCategory = !hasChildren ? currentCategory.parent_category : null;

  // State for storing the children of the parent category
  const [parentCategoryChildren, setParentCategoryChildren] = useState<Category[]>([]);

  useEffect(() => {
    if (parentCategory) {
      // Assuming you have access to a function to fetch a category by ID
      // or modify the logic as per your API's capabilities
      axios.get(`${MEDUSA_BACKEND_URL}/store/product-categories/${parentCategory.id}`)
        .then(response => {
          const fetchedParentCategory = response.data.product_category;
          setParentCategoryChildren(fetchedParentCategory.category_children || []);
        })
        .catch(error => console.error('Error fetching parent category children:', error));
    }
  }, [parentCategory]);

  // Additional state to store images of parent category and its children
  const [parentCategoryImage, setParentCategoryImage] = useState<string>('');

  // Fetching images for parent category and its children
  useEffect(() => {
    const fetchImages = async () => {
      if (parentCategory) {
        const response = await axios.get(`${MEDUSA_BACKEND_URL}/store/categoryImage`, {
          params: { category_id: parentCategory.id }
        });
        if (response.data && response.data.data && response.data.data.length > 0) {
          setParentCategoryImage(response.data.data[0].categorythumbnail);
        }

        parentCategoryChildren.forEach(async (child) => {
          const childResponse = await axios.get(`${MEDUSA_BACKEND_URL}/store/categoryImage`, {
            params: { category_id: child.id }
          });
          if (childResponse.data && childResponse.data.data && childResponse.data.data.length > 0) {
            setCategoryImages(prevImages => ({
              ...prevImages,
              [child.id]: childResponse.data.data[0].categorythumbnail
            }));
          }
        });
      }
    };

    fetchImages();
  }, [parentCategory, parentCategoryChildren]);

  const modifyName = (name: string): string => {
    let modifiedName = name;
    parentCategories.forEach(parentCategory => {
      const regex = new RegExp(`\\b${parentCategory.name}\\b`, 'i');
      modifiedName = modifiedName.replace(regex, '').trim();
    });
    return modifiedName;
  };

  const [showLoadingMessage, setShowLoadingMessage] = useState(true);

  useEffect(() => {
    // Set a timeout for 30 seconds
    const timeoutId = setTimeout(() => {
      setShowLoadingMessage(false);
    }, 20000);

    return () => {
      // Clear the timeout if the component unmounts
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Hide loading message when products are available
    if (filteredProducts.length > 0) {
      setShowLoadingMessage(false);
    }
  }, [filteredProducts.length]);

// console.log('filteredProducts', filteredProducts)
// console.log("product details at category ",productDetails)

// Function to get all unique color values from product details
const getColorValues = (productDetails: ProductDetail[]): string[] => {
  const colorValuesSet = new Set<string>(); // Using a Set to avoid duplicates

  productDetails.forEach((product: ProductDetail) => {
    const colorOption = product.options.find((option: ProductOption) => option.title.toLowerCase() === "color");
    if (colorOption && Array.isArray(colorOption.values)) {
      colorOption.values.forEach((value: ProductOptionValue) => {
        colorValuesSet.add(value.value);
      });
    }
  });

  return Array.from(colorValuesSet); // Convert Set to Array
};

const getSizeValues = (productDetails: ProductDetail[]): string[] => {
  const sizeValuesSet = new Set<string>(); // Using a Set to avoid duplicates

  productDetails.forEach((product: ProductDetail) => {
    const sizeOption = product.options.find((option: ProductOption) => option.title.toLowerCase() === "size");
    if (sizeOption && Array.isArray(sizeOption.values)) {
      sizeOption.values.forEach((value: ProductOptionValue) => {
        sizeValuesSet.add(value.value);
      });
    }
  });

  return Array.from(sizeValuesSet); // Convert Set to Array
};
 // Get color values from product details
 const colorValues = getColorValues(productDetails);

 const sizeValues = getSizeValues(productDetails);
 

//  console.log('colorValues', colorValues)


  // Function to handle checkbox change
  const handleColorCheckboxChange = (color: string) => {
    setSelectedColors((prevSelectedColors) => {
      const newSelectedColors = new Set(prevSelectedColors);
      if (newSelectedColors.has(color)) {
        newSelectedColors.delete(color);
      } else {
        newSelectedColors.add(color);
      }
      return newSelectedColors;
    });
  };

  // console.log('selectedColors', selectedColors)

  const handleSizeCheckboxChange = (size: string) => {
    setSelectedSizes((prevSelectedSizes) => {
      const newSelectedSizes = new Set(prevSelectedSizes);
      if (newSelectedSizes.has(size)) {
        newSelectedSizes.delete(size);
      } else {
        newSelectedSizes.add(size);
      }
      return newSelectedSizes;
    });
  };

  // console.log('selectedSizes', selectedSizes)

    // Update filteredProducts when productDetails changes
  useEffect(() => {
    setFilteredProducts(productDetails);
  }, [productDetails]);

  // console.log('first', categories)
  // console.log('cate children', category.category_children)
  // console.log('selectedCategories', selectedCategories)

  const handleApplyFilter = async () => {
    // Close the filter menu
    handleFilterMenuClose();
  
    // console.log('inside applyfilter')
     // Fetch product IDs for all selected categories beforehand
  const categoryProductIdsMap = new Map();
  for (const category of Array.from(selectedCategories)) {
    // console.log('category at select', category)
    const productIds = await fetchAllChildCategoryProductIds(category.id);
    // console.log('productIds at select', productIds)
    categoryProductIdsMap.set(category.id, productIds);
  }

    // Filter logic
    let filtered = productDetails.filter((product) => {
      const price = product.price / 100; // Assuming the price is in cents
      const matchesPrice = (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
  
      // Check for color match
      const colorOption = product.options.find((option: ProductOption) => option.title.toLowerCase() === "color");
      const matchesColor = colorOption
        ? Array.from(colorOption.values).some((value: any) =>
            Array.from(selectedColors).some(selectedColor =>
              value.value.toLowerCase() === selectedColor.toLowerCase())
          )
        : true; // If no color selected, consider it a match
  
      // Check for size match
      const sizeOption = product.options.find((option: ProductOption) => option.title.toLowerCase() === "size");
      const matchesSize = sizeOption
        ? Array.from(sizeOption.values).some((value: any) =>
            Array.from(selectedSizes).some(selectedSize =>
              value.value.toLowerCase() === selectedSize.toLowerCase())
          )
        : true; // If no size selected, consider it a match
  
        // Check if the product belongs to one of the selected categories

        const matchesCategory = Array.from(categoryProductIdsMap.values()).some(ids => ids.includes(product.id));

        if(selectedSizes.size > 0 && selectedColors.size ===0 && selectedCategories.length ===0)
        {
          // console.log('product both', product)
          return  matchesSize; // Match either color or size

        }  
        if(selectedColors.size > 0 && selectedSizes.size ===0 && selectedCategories.length ===0)
        {
          // console.log('product both', product)
          return  matchesColor; // Match either color or size

        }    
        if(selectedCategories.length > 0 && selectedColors.size ===0 && selectedSizes.size ===0)
        {
          // console.log('product both', product)
          return  matchesCategory; // Match either color or size

        }   
        if(selectedSizes.size > 0 && selectedColors.size > 0 && selectedCategories.length === 0)
        {
          // console.log('product both', product)
          return (matchesColor && matchesSize); // Match either color or size

        }
      
        if( selectedColors.size > 0 && selectedCategories.length > 0 && selectedSizes.size === 0)
        {
          // console.log('product both', product)
          return (matchesColor && matchesCategory); // Match either color or size

        }
        if(selectedSizes.size > 0 && selectedCategories.length > 0 && selectedColors.size === 0)
        {
          // console.log('product both', product)
          return (matchesSize && matchesCategory); // Match either color or size

        }
        if(selectedSizes.size > 0 && selectedColors.size > 0 && selectedCategories.length > 0)
        {
          // console.log('product both', product)
          return (matchesColor && matchesSize && matchesCategory); // Match either color or size

        }
        return matchesPrice || (matchesColor || matchesSize || matchesCategory);
      });
  
    // Apply sorting based on the selected criteria
    if (sortCriteria === 'highestPrice') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === 'lowestPrice') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'latestArrivals') {
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortCriteria === 'sales') {
      filtered.sort((a, b) => {
        const totalSoldA = Array.isArray(a.variants) ? a.variants.reduce((total: number, variant: { sales_quantity: number }) => { return total + (variant.sales_quantity || 0)}, 0) : 0;
        const totalSoldB = Array.isArray(b.variants) ? b.variants.reduce((total: number, variant: { sales_quantity: number }) => { return total + (variant.sales_quantity || 0)}, 0) : 0;
        return totalSoldB - totalSoldA;
      });
    }
  
    setFilteredProducts(filtered);
  };
  return (
    <div className="content-container py-6 " style={{ marginTop: "0%", fontFamily:"Klein, sans-serif", background:"rgb(250,250,250)" }}>

       {/* Side menu bar for filters */}
       <div
  style={{
    position: 'fixed',
    left: isFilterSidebarOpen ? 0 : '-100%',
    top: 0,
    width: '420px',
    height: '100%',
    background: 'white',
    zIndex: 1000,
    transition: 'left 0.3s',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }}
>
<div
 style={{
    position:"sticky",
    width: '100%',
    fontWeight: 600,
    fontSize:"17px",
    letterSpacing:"0.1em",
    padding: '10px 0',
    boxSizing: 'border-box',
 }} >
  
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:"" }}>
    {/* Content of the side menu bar */}
    <h2 style={{fontWeight: "bold", fontSize: "22px", textAlign:"center", margin: 'auto'}}>SELECT FILTER</h2>
    <FontAwesomeIcon
        icon={faXmark}
        onClick={() => setIsFilterSidebarOpen(false)}
        style={{ cursor: 'pointer', marginRight:"5%", fontSize:"22px", fontWeight: 400 }}
    />
</div>

  
 {/* Rest of your content */}
</div>

<div
  style={{
    padding: "38px",
    overflowY: "auto",
    maxHeight: "calc(100% - 70px)"
  }}
  className="sidebar-content" // Add this class name
>        {/* Close Icon */}

      <div>

      <div>
      <div onClick={() => setShowColorCheckboxes(!showColorCheckboxes)}
      style={{
        cursor: 'pointer',
        border: showColorCheckboxes ? '1px dotted black' : 'none',
        padding: '2px 6px',
        background: 'none',
        outline: 'none',
        boxShadow: 'none',
       display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"10%",lineHeight:"3em" }}>

            <h3>COLOR</h3>
           
              <FontAwesomeIcon icon={showColorCheckboxes ? faAngleUp : faAngleDown} />
  </div>
  <hr />
  {showColorCheckboxes && (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', rowGap: '20px', marginTop: '12%' }}>
  {colorValues.map((color) => (
    <div key={color} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="checkbox"
        id={`color-checkbox-${color}`}
        name="color"
        value={color}
        checked={selectedColors.has(color)}
        onChange={() => handleColorCheckboxChange(color)}
      />
      <label htmlFor={`color-checkbox-${color}`} style={{ marginLeft: '8px', fontSize: '15px', marginBottom:"-13%" }}>{color}</label>
    </div>
  ))}
</div>

  )}
</div>


<div>
<div   onClick={() => setShowSizeCheckboxes(!showSizeCheckboxes)}
      style={{
        cursor: 'pointer',
        border: showSizeCheckboxes ? '1px dotted black' : 'none',
        padding: '2px 6px',
        background: 'none',
        outline: 'none',
        boxShadow: 'none',
       display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"6%",lineHeight:"3em" }}>

    <h3>SIZE</h3>
   
      <FontAwesomeIcon icon={showSizeCheckboxes ? faAngleUp : faAngleDown} />
  </div>
  <hr />
  {showSizeCheckboxes && (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', rowGap: '20px', marginTop: '12%' }}>
  {sizeValues.map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id={`size-checkbox-${size}`}
            name="size"
            value={size}
            checked={selectedSizes.has(size)}
            onChange={() => handleSizeCheckboxChange(size)}
          />
          <label htmlFor={`size-checkbox-${size}`} style={{ marginLeft: '8px', fontSize: '15px', marginBottom:"-13%" }}>{size}</label>
        </div>
      ))}
    </div>
  )}
</div>
<div>
<div     onClick={() => setShowCategoriesCheckboxes(!showCategoriesCheckboxes)}
      style={{
        cursor: 'pointer',
        border: showCategoriesCheckboxes ? '1px dotted black' : 'none',
        padding: '2px 6px',
        background: 'none',
        outline: 'none',
        boxShadow: 'none',
       display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"6%",lineHeight:"3em" }}>
    <h3>CATEGORY</h3>

    <FontAwesomeIcon icon={showCategoriesCheckboxes ? faAngleUp : faAngleDown} />
</div>
<hr />
{showCategoriesCheckboxes && category.category_children && (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px', marginTop: '10%' }}>
    {category.category_children.map((child, index) => (
      <div key={child.id} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id={`category-checkbox-${child.id}`}
          name="category"
          value={child.id}
          checked={selectedCategories.some(c => c.id === child.id)}
          onChange={() => handleCategoryChange({id: child.id, name: child.name})}
        />
        <label htmlFor={`category-checkbox-${child.id}`} style={{ marginLeft: '8px', fontSize: '17px', marginBottom:"-13%" }}>
          {modifiedChildrenNames[index]} {/* Use modified name here */}
        </label>
      </div>
    ))}
  </div>
)}


</div>

       <div>
  <div     onClick={() => setShowPriceCheckboxes(!showPriceCheckboxes)}
      style={{
        cursor: 'pointer',
        border: showPriceCheckboxes ? '1px dotted black' : 'none',
        padding: '2px 6px',
        background: 'none',
        outline: 'none',
        boxShadow: 'none',
       display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:"6%",lineHeight:"3em" }}>
    <h3>PRICE</h3>
   
      <FontAwesomeIcon icon={showPriceCheckboxes ? faAngleUp : faAngleDown} />
  </div>
  <hr />
  {showPriceCheckboxes && (
    <div style={{ display: 'flex', gap: '10px', marginTop: '6%' }}>
      <TextField
        label="Min Price"
        variant="outlined"
        size="small"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(Number(e.target.value))}
        margin="normal"
        style={{ flex: 1 }}
      />
      <TextField
        label="Max Price"
        variant="outlined"
        size="small"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        margin="normal"
        style={{ flex: 1 }}
      />
    </div>
  )}
</div>

        {/* <Button variant="primary" color="primary" onClick={handleApplyFilter}>
          Apply Filters
        </Button> */}
      </div>
      </div>
      <div
    style={{
      position:"sticky",
      width: '100%',
      background: 'RGBA(0, 0, 0, 0.4)',
      color: 'white',
      cursor:"pointer",
      textAlign: 'center',
      fontWeight: 600,
      fontSize:"17px",
      letterSpacing:"0.1em",
      padding: '10px 0',
      boxSizing: 'border-box',
    }}
    onClick={handleClearFilters}
  >
    CLEAR FILTERS
  </div>
    </div>

    {/* Overlay to darken the rest of the content when side menu is open */}
    {isFilterSidebarOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999, // Just below the side bar
        }}
        onClick={() => setIsFilterSidebarOpen(false)}
      />
    )}

      <div className="flex flex-row mb-8 text-2xl-semi gap-4">
        {parents &&
          parents.map((parent) => (
            <span key={parent.id} className="text-black">
              <Link
                className="mr-4 hover:text-black"
                href={`/${parent.handle}`}
              >
                Parent {parent.name}
              </Link>
              /
            </span>
          ))}
      </div>


      {categories[0].parent_category && category.category_children && category.category_children.length > 0 && (
        <div className="mb-8 text-base-large flex justify-center">
          <ul className="flex gap-7 items-start">
            {categories.length > 0 && (
              <div className="flex flex-col items-center mr-4">
                {categoryImages[categories[0].id] && (
                  <img
                    src={categoryImages[categories[0].id]}
                    alt={categories[0].name}
                    className="selected-image-size rounded-full mb-4 border-black"
                  />
                )}
                <Link href={`/${categories[0].handle}`} className="" style={{ fontWeight: 500 }}>
                  {modifiedCategoryName}
                </Link>
              </div>
            )}

            {category.category_children.map((c, index) => ( // 'index' is now defined here
              <li key={c.id} className="text-center">
                <Link href={`/${c.handle}`} className="">
                  {categoryImages[c.id] && (
                    <img
                      src={categoryImages[c.id]}
                      alt={c.name}
                      className="custom-image-size rounded-full mb-4"
                    />
                  )}
                  {modifiedChildrenNames[index]} {/* 'index' is used here */}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display parent category and its children categories with images */}
      {!hasChildren && parentCategoryChildren.length > 0 && (
        <div className="mb-8 text-base-large flex justify-center gap-7">


          <ul className="flex gap-7 items-start">
            {parentCategoryChildren.map(child => (
              <li key={child.id} style={{ textAlign: "center" }}>
                <Link href={`/${child.handle}`}>
                  {categoryImages[child.id] && (
                    <img
                      src={categoryImages[child.id]}
                      alt={child.name}
                      className={`${child.id === currentCategory.id ? 'selected-image-size' : 'custom-image-size'} rounded-full mb-4`}
                    />
                  )}
                  <span>{capitalizeWords(modifyName(child.name))}</span>
                </Link>
              </li>
            ))}
          </ul>
          {parentCategoryImage && (
            <div style={{ textAlign: "center" }}>
              <Link href={`/${parentCategory?.handle}`}>

                <img
                  src={parentCategoryImage}
                  alt={parentCategory?.name}
                  className="custom-image-size rounded-full mb-4"
                />
                <span style={{ textAlign: "center" }}>{capitalizeWords(modifyName(parentCategory?.name || ''))}</span>
              </Link>
            </div>
          )}
        </div>
      )}



{showLoadingMessage ? (
        <div className="loading-message text-center">
          <h1 style={{fontSize:"24px", fontWeight: 500}}>Please wait while we load products...</h1>
        </div>
      ) : productDetails.length > 0 ? (
        <>

          {/* Filter options */}
          <div className="filter-sort-container" >
          {/* <div className="color-filter" style={{background:"white"}}>
  <TextField
    label="Filter by Color"
    variant="outlined"
    size="small"
    value={colorFilter}
    onChange={(e) => setColorFilter(e.target.value)}
    style={{ marginRight: '20px' }}
  />
</div> */}

  <div className="flex gap-4 mb-4 pb-8" style={{  display: "inline-block",
    marginLeft:"6%",
    background: "black",
    color: "white",
    padding: "1% 1%", // This adds padding on the sides of the text.
    fontSize: "14px", // Adjust the font size as needed.
    lineHeight: "24px", // Adjust the line height to control the height of the black background.
    textAlign: "center",
    fontWeight: 700, // This makes the text bold.
    borderRadius:"10px"}}>
    {/* Filter button */}
    <Button
          aria-controls="filter-menu"
          aria-haspopup="true"
          onClick={handleFilterClick}
          style={{ background: "white", color: "black" }}
        >
          Filter
          <img src="/filter_icon.png" alt="Filter" style={{ width: '24px', height: '24px', marginLeft: '5px' }} />
        </Button>
        <Menu
          id="filter-menu"
          anchorEl={filterAnchorEl}
          keepMounted
          open={isFilterMenuOpen}
          onClose={handleFilterMenuClose}
        >
          <MenuItem>
            <TextField
              label="Color"
              variant="outlined"
              size="small"
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <TextField
              label="Min Price"
              variant="outlined"
              size="small"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              style={{ marginRight: '10px' }}
            />
            <TextField
              label="Max Price"
              variant="outlined"
              size="small"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </MenuItem>
          {/* <MenuItem onClick={handleApplyFilter}>Apply Filters</MenuItem> */}
          <MenuItem onClick={handleClearClick} style={{}}>Clear Filters</MenuItem>
        </Menu>
    <Button 
      aria-controls="sort-menu"
      aria-haspopup="true"
      onClick={handleSortMenuClick}
      className="ml-2"
      style={{ border: "1px solid #ccc" }}
    >
      Sort <FontAwesomeIcon icon={faSort} />
    </Button>
    <Menu
      id="sort-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleSortMenuClose}
    >
      <MenuItem onClick={sortByLatestArrivals}>Sort by Latest Arrivals</MenuItem>
      <MenuItem onClick={sortBySales}>Sort by Sales</MenuItem>
      <MenuItem onClick={sortByHighestPrice}>Sort by Price High to Low</MenuItem>
      <MenuItem onClick={sortByLowestPrice}>Sort by Price Low to High</MenuItem>
    </Menu>
  </div>
</div>

          </>
      ) : (
        <div className="no-products-message">
          <h1>Sorry, There are no products under {category.name} available</h1>
        </div>
      )}


      <div className="product-details grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {filteredProducts.map((product, index) => (
          <ProductWithPrice key={index} productId={product.id} />
        ))}
      </div>

      <div className="no-products-message">
        { productDetails.length> 0 && filteredProducts.length ===0 && (
          <h1>Sorry, There are no matching products available</h1>
          )}
      </div>
    </div>
  )
}

export default CategoryTemplate