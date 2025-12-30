import type { Metadata } from 'next'
import './globals.css'

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
                    {children}
                </div>
            </body>
        </html>
    )
}
