import type { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'FlowAssistant',
  description: 'Voice Engineering Agency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-white antialiased selection:bg-indigo-500/30">
        <div className="relative z-0 min-h-screen w-full overflow-hidden">
          <div className="absolute top-6 left-8 z-50 pointer-events-none select-none">
            <Image
              src="/Flowassis.png"
              alt="FlowAssistant Logo"
              width={200}
              height={60}
              className="w-32 md:w-40 h-auto object-contain opacity-90"
              priority
            />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
