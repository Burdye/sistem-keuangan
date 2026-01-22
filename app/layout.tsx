import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { TransactionsProvider } from "@/contexts/TransactionsContext"
import { CategoriesProvider } from "@/contexts/CategoriesContext"

import { EventsProvider } from "@/contexts/EventsContext"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Keuangan Dhananjaya",
  description: "Sistem Manajemen Keuangan Komunitas Dhananjaya",
  generator: "Dhananjaya System",
  icons: {
    icon: [
      {
        url: "/logo-dhananjaya.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-dhananjaya.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo-dhananjaya.png",
        type: "image/png",
      },
    ],
    apple: "/logo-dhananjaya.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <CategoriesProvider>
          <TransactionsProvider>
            <EventsProvider>
              {children}
              <Toaster richColors position="top-center" />
            </EventsProvider>
          </TransactionsProvider>
        </CategoriesProvider>
        <Analytics />
      </body>
    </html>
  )
}
