import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import Nav from "@/components/layout/nav"
import Providers from "@/lib/providers";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DhruvCraftsHouse",
  description: "Dhruv Crafts House",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Providers > */}
      <body className={inter.className}>
      {/* <Suspense> */}

        <Providers>
        <Nav />
        {children}
        <Footer />
        </Providers>
        {/* </Suspense> */}
      </body>
      {/* </Providers> */}
    </html>
  );
}
