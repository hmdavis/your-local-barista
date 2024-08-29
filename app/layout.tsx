import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';
import Script from 'next/script';

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
      <body>
        <header>
          <h1>Your Local Barista</h1>
          {/* You can add a navigation bar or other header content here */}
        </header>
        <main>{children}</main>

        <footer style={{ marginTop: "20px" }}>
          <DynamicSpotifyEmbed />
          <p>© 2024 @hotmdog. All rights reserved.</p>
          <DynamicBuyAMeCoffeeButton />
        </footer>
      </body>
    </html>
  );
}
