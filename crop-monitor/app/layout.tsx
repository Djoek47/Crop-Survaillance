import type { Metadata } from 'next'
import { Roboto, Roboto_Condensed, Roboto_Slab } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const robotoCondensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
})

const robotoSlab = Roboto_Slab({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-slab',
})

export const metadata: Metadata = {
  title: 'Crop Monitor',
  description: 'AI-powered crop monitoring for modern farmers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${robotoCondensed.variable} ${robotoSlab.variable}`}>
      <body className={roboto.className}>
        <header className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <nav>
              <ul className="flex flex-wrap space-x-4">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li></li>
                <li><Link href="/features" className="hover:underline">Features</Link></li>
                <li><Link href="/image-analysis" className="hover:underline">AI Crop Analysis</Link></li>
                <li><Link href="/advanced-crop-management" className="hover:underline">Advanced Crop Management</Link></li>
                <li><Link href="/roadmap" className="hover:underline">Roadmap</Link></li>
                
              </ul>
            </nav>
            <Link 
              href="/dashboard" 
              className="bg-green-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Dashboard
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="container mx-auto px-4 py-6 text-center">
        <Link 
              href="/about" 
              className="bg-yellow-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              About Crop Monitor
            </Link>
          <div className="container mx-auto px-4 py-6 text-center">
            © 2024 Crop Monitor. All rights reserved by plants and mother earth.
          </div>
        </footer>
      </body>
    </html>
  )
}