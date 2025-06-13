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
      <head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Temukan dan beli tiket event budaya terbaik di Indonesia. Festival, pertunjukan seni, workshop, kuliner tradisional, dan tour budaya." />
        <meta name="keywords" content="event budaya indonesia, festival indonesia, pertunjukan seni, workshop budaya, kuliner tradisional, tour budaya, tiket event" />
        <meta name="author" content="LokaBudaya Team" />
        
        {/* Open Graph Tags untuk Facebook, WhatsApp, dll */}
        <meta property="og:title" content="LokaBudaya - Platform Event Budaya Indonesia" />
        <meta property="og:description" content="Temukan dan beli tiket event budaya terbaik di Indonesia. Festival, pertunjukan seni, workshop, kuliner tradisional, dan tour budaya." />
        <meta property="og:image" content="https://lokabudaya.my.id/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LokaBudaya - Platform Event Budaya Indonesia" />
        <meta property="og:url" content="https://lokabudaya.my.id" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LokaBudaya" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LokaBudaya - Platform Event Budaya Indonesia" />
        <meta name="twitter:description" content="Temukan dan beli tiket event budaya terbaik di Indonesia" />
        <meta name="twitter:image" content="https://lokabudaya.my.id/images/og-image.png" />
        <meta name="twitter:image:alt" content="LokaBudaya - Platform Event Budaya Indonesia" />
        
        {/* WhatsApp specific (menggunakan og tags) */}
        <meta property="og:image:type" content="image/png" />
        
        {/* Telegram specific */}
        <meta name="telegram:channel" content="@lokabudaya" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo_main.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#166534" />
        <meta name="msapplication-TileColor" content="#166534" />
      </head>
      <body className="flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  )
}