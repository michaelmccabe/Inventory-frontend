import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Manage inventory items and orders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
