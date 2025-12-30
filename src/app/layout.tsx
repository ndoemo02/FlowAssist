import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

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
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="bg-[#020617] text-white antialiased selection:bg-indigo-500/30">
                <div className="relative z-0 min-h-screen w-full overflow-hidden">
                    {children}
                </div>
            </body>
        </html>
    )
}
