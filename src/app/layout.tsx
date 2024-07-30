import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head'
import Link from 'next/link'
import "../styles/globals.css";
import { TooltipProvider } from "@components/ui/tooltip";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Big Loser Football",
  description: "Big Loser Olympics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <body className={`${inter.className}`}>
        {/*<nav style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
          <Link style={{ marginRight: '10px' }} href="/">Standings</Link>
          <Link href="/teams">Teams</Link>
        </nav> */}
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
