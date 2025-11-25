import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "PodRead - Visual Notes for Your Ears",
  description: "Get the best insights from your favorite podcasts in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonText.variable} antialiased`}>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 md:ml-0 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
