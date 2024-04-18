"use client";

import React, { useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import Hero from "@/components/home/components/hero"
import { Suspense } from "react"
import SkeletonHomepageProducts from "@/components/skeletons/components/skeleton-homepage-products"
import FeaturedProducts from "@/components/home/components/featured-products"
import { getCollectionsList } from "@/lib/data"

export default function Home() {
 // Scroll to top on component mount
 useEffect(() => {
    window.scrollTo(0, 0);
 }, []); // Empty dependency array ensures this runs once on mount

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
