"use client";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav";
import React, { useState, useEffect, Suspense } from 'react';
import LoadingSpinner from "@/components/loader"; // Import your loading spinner component
import { useParams } from 'next/navigation'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const [navBackground, setNavBackground] = useState(true);
  // const params = useParams();

  // useEffect(() => {
  //   // Check if params is an empty object
  //   const isParamsEmpty = Object.keys(params).length === 0;
  
  //   // Extracting the category value from params if it's not empty
  //   const category = !isParamsEmpty && params.category && params.category.length > 0 ? params.category[0] : null;
  
  //   // Set navBackground based on whether params is empty or category is 'men' or 'women'
  //   setNavBackground(category === 'men' || category === 'women');
  
  //   console.log("Category from params:", category);
  // }, [params]); // Depend on params object
  
  // useEffect(() => {
  //   if (location && location.pathname) {
  //     const currentPathname = location.pathname;
  //     // console.log('currentPathname', currentPathname);
  
  //     // Update navBackground based on currentPathnameac
  //     const homebool =  currentPathname.trim() === '/' ;
  //     setNavBackground(homebool);
  
      
  //     // console.log('navBackground', homebool); // Print the updated value
  //   }
  // }, [location.pathname]);
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
    <div>
      <Nav />
      {/* {navBackground &&(
      <VideoNavHeader />

       )}  */}
       {/* {children} */}

       {children}

      <Footer />
    </div>
    </Suspense>
  )
}
