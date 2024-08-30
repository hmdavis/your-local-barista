import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Coffee, MapPin, Music, DollarSign, Search } from 'lucide-react'

export const metadata = {
  title: 'My Next.js App',
  description: 'A sample Next.js application',
};


const DynamicSpotifyEmbed = dynamic(() => import('./components/SpotifyEmbed'), { ssr: false });
const DynamicBuyAMeCoffeeButton = dynamic(() => import('./components/BuyMeACoffeeButton'), { ssr: false });


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <header className="bg-gray-900 text-white p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl">Your Local Barista</h1>
            <a
              href="https://cash.app/$hotmdog"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-black hover:bg-yellow-600 px-4 py-2 rounded-full flex items-center"
            >
              <DollarSign className="mr-2 h-4 w-4" /> Tip Your Barista
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {children}
            <DynamicSpotifyEmbed />
          </div>
        </main>

        {/* <footer style={{ marginTop: "20px" }}>
          <DynamicSpotifyEmbed />
          <p>© 2024 @hotmdog. All rights reserved.</p>
          <DynamicBuyAMeCoffeeButton />
        </footer> */}

        <footer className="bg-black text-white p-6 text-center">
            <p>© 2024</p>
        </footer>
      </body>
    </html>
  );
}
