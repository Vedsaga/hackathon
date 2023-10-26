import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bring Down Counterfiting',
  description: 'This is quick demo of how we can use layer 1 and layer 2 approach to bring down counterfiting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} my-8 mx-4 xl:mx-20`}>
        {children}
      </body>
    </html>
  );
}
