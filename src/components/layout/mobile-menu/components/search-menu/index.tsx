import { useMobileMenu } from "@/lib/context/mobile-menu-context"
import { searchClient, SEARCH_INDEX_NAME } from "@/lib/search-client"
import { InstantSearch } from "react-instantsearch-hooks-web"
import MobileSearchComponent from "@/components/layout/mobile-search-component"

const SearchMenu = () => {
  const {
    screen: [_, setScreen],
    close,
  } = useMobileMenu()

  return (
    <>
      {/* <div className="flex flex-col flex-1" style={{background:""}}>
        <div className="flex items-center justify-between w-full border-b border-gray-200 py-4 px-6" >
          <div className="flex-1 basis-0">
            <div className="flex items-center gap-x-2">
              <MagnifyingGlassMini />
              <SearchBox close={close} />
            </div>
          </div>
          <div className="flex justify-end ml-4">
            <button
              onClick={() => setScreen("main")}
              className="text-small-semi uppercase"
            >
              Cancel
            </button>
          </div>
        </div> */}
        
        <MobileSearchComponent setScreen={setScreen} />

        {/* <div className="py-4 px-8" style={{background:"yellow"}}>
          <MobileHits hitComponent={MobileHit} />
        </div> */}
      {/* </div> */}
    </>
  )
}

export default SearchMenu