import './globals.css'

export const metadata = {
  title: 'LokaBudaya - Platform Event Budaya Indonesia',
  description: 'Temukan dan beli tiket event budaya terbaik di Indonesia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen font-sans">{children}</body>
    </html>
  )
}