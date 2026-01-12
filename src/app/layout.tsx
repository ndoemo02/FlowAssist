import type { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'FlowAssistant',
  description: 'Voice Engineering Agency',
}

import { ViewProvider } from '@/context/ViewProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="bg-[#020617] text-white antialiased selection:bg-indigo-500/30">
        <div className="relative z-0 min-h-screen w-full overflow-hidden">
          <ViewProvider>
            <Navbar />
            {children}
          </ViewProvider>
        </div>
      </body>
    </html>
  )
}
