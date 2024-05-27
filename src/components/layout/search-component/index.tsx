import { Popover } from "@headlessui/react"
import Link from "next/link"
import SearchIcon from "@/components/common/icons/search"
import React, { useState, useEffect, useRef } from 'react';
import { ProductCollection } from "@medusajs/medusa"
import Medusa from "@medusajs/medusa-js"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { usePathname } from 'next/navigation'
import { MEDUSA_BACKEND_URL } from "@/lib/config"

const LoadingSpinner = () => {
  return (
    <div className="loader-style">
      <div>Please wait while we load the page for you...</div>
      <style>{`
        .loader-style {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          font-size: 20px;
          color: black;
        }
      `}</style>
    </div>
  );
};

const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

interface SearchComponentProps {
  isSideMenuOpen: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ isSideMenuOpen }) => {
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [products, setProducts] = useState<PricedProduct[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    medusa.products
      .list()
      .then(({ products }) => {
        setProducts(products.map(product => {
          if (product.thumbnail) {
            const newThumbnailUrl = product.thumbnail.replace(
              'http://localhost:9000',
              'https://dhruvcraftshouse.com/backend'
            );
            return { ...product, thumbnail: newThumbnailUrl };
          }
          return product;
        }));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleIconClick = () => {
    setIsPopoverOpen(true);
  };

  const handleOverlayClick = () => {
    setIsPopoverOpen(false);
    setSearchText("");
  };

  const handleCloseClick = () => {
    setIsPopoverOpen(false);
    setSearchText("");
  };

  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [clickedPath, setClickedPath] = useState('');

  useEffect(() => {
    setClickedPath(pathname);
  }, [pathname]);

  useEffect(() => {
    setIsNavigating(pathname !== clickedPath);
  }, [pathname, clickedPath]);

  const handleLinkClick = (targetPath: string) => {
    if (targetPath === pathname) {
      console.log("Already on the same page:", targetPath);
      return;
    }

    console.log("Link clicked with path:", targetPath);
    setClickedPath(targetPath);
    setIsNavigating(true);
  };

  return (
    <div className="relative z-50">
      {isPopoverOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={handleOverlayClick}
        ></div>
      )}

      <Popover className="relative">
        <>
          {isNavigating && <LoadingSpinner />}

          <button className="" onClick={handleIconClick} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SearchIcon width="12" height="12" />
            <span>{isSideMenuOpen ? "SEARCH" : "Search"}</span>
          </button>

          <Popover.Panel
            static
            ref={panelRef}
            className={`fixed top-0 right-0 bottom-0 z-50 text-sm m-0  ${isPopoverOpen ? "" : "hidden"}`}
            style={{ height: '100vh', width: "40vw",background:"black" }}
          >
            <div className="flex flex-col bg-[rgba(0,0,0,0.9)] justify-between p-9 text-white" style={{ color: "white", paddingBottom: "75%" }}>
              <button
                onClick={handleCloseClick}
                className="absolute top-2 right-2 text-white cursor-pointer"
              >
                X
              </button>

              <form
                style={{
                  display: "flex",
                  flexDirection: "row",
                  boxSizing: "border-box",
                  marginTop: "8%",
                  // background:"red",
                  marginBottom: "8%"
                }}
              >
                <button
                  style={{
                    padding: "8px 15px",
                  }}
                >
                  <SearchIcon />
                </button>
                <input
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value)
                    handleSearchChange(e)
                  }}
                  style={{
                    flexGrow: "2",
                    border: "none",
                    boxSizing: "border-box",
                    width: "100%",
                    margin: "12px 0",
                    color: "white",
                    background: "transparent",
                    fontSize: "22px",
                    fontFamily: "Klein, sans-serif",
                    fontWeight: 500,
                    textAlign:"center"
                  }}
                  placeholder="What are you looking for?"
                  id="input-id"
                  type="text"
                  ref={inputRef}
                  autoFocus
                  className="no-placeholder-on-focus"
                />
              </form>

              <ul className="flex flex-wrap overflow-y-auto custom-scrollbar" style={{ listStyle: "none", maxHeight: "90vh" }}>
                {products
                  .filter((product) => {
                    const titleMatch = product.title?.toLowerCase().includes(searchText.toLowerCase());
                    const tagMatch = product.tags?.some(tag => tag.value?.toLowerCase().includes(searchText.toLowerCase()));
                    return titleMatch || tagMatch;
                  })
                  .slice(0, 6)
                  .map((product) => (
                    <li
                      key={product.id}
                      className="flex-grow-0 flex-shrink-0 w-1/2 px-4 py-4"
                    >
                      <Link
                        href={`/products/${product.handle}`}
                        // onClick={() => handleLinkClick(`/products/${product.handle}`)}
                        className="font-medium hover:text-primary transition duration-150 ease-in-out"
                      >
                        {product.thumbnail && (
                          <img src={product.thumbnail} alt={product.title || 'Product'} width="100%" />
                        )}
                        <div>{product.title || 'Untitled Product'}</div>
                        {product.variants && product.variants.length > 0 && product.variants[0].prices && product.variants[0].prices.length > 0 && (
                          <div className="text-primary mt-1">
                            {currencyFormatter.format(product.variants[0].prices[0].amount / 100)}
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </Popover.Panel>
        </>
      </Popover>
      <style>
        {`input:focus::placeholder {
          color: transparent;
        }
        input:focus {
          outline: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: white;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f0f0f0;
        }`}
      </style>
    </div>
  );
};

export default SearchComponent;
