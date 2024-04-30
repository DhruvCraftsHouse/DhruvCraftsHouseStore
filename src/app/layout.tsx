import Providers from "@/lib/providers";
import "./globals.css"
import React, { useState, useEffect, Suspense } from 'react';
import LoadingSpinner from '@/components/loader'; // Import your loading spinner component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Providers>
        <Suspense fallback={<LoadingSpinner />}><main className="relative">{children}</main></Suspense>
        </Providers>
      </body>
    </html>
  )
}
