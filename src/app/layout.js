import './globals.css'
import { Aboreto, Inter, Poppins } from 'next/font/google'

// Font Aboreto untuk judul/heading
export const aboreto = Aboreto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-aboreto',
})

// Font Inter untuk body text
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Font Poppins untuk UI elements
export const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'LokaBudaya - Platform Event Budaya Indonesia',
  description: 'Temukan dan beli tiket event budaya terbaik di Indonesia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${aboreto.variable} ${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}