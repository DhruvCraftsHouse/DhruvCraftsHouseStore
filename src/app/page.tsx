import Link from 'next/link';
import Hero from "@/components/home/components/hero"
import { Suspense } from "react"
import SkeletonHomepageProducts from "@/components/skeletons/components/skeleton-homepage-products"
import FeaturedProducts from "@/components/home/components/featured-products"
import { getCollectionsList } from "@/lib/data"


export default async function Home() {
  // const { collections, count } = await getCollectionsList(0, 3)

  return (
    <>
            <Hero />
            {/* <Suspense fallback={<div>Loading...</div>}> */}
        <FeaturedProducts />
      {/* </Suspense> */}


    </>
  );
}
