import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaboAi - AI-Powered Email Assistant for Los Cabos Businesses",
  description: "Intelligent email response generation for hospitality, real estate, and tourism businesses in Los Cabos, Mexico.",
  keywords: "AI, email assistant, Los Cabos, business automation, hospitality, real estate, tourism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
