import { Metadata } from "next";
import "animate.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";
import { NotificationProvider } from "@/components/Context/NotificationContext";


import ChatBot from "@/components/ChatBot/ChatBot";

// Importing fonts with subsets and variable names for CSS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defining metadata for the page
export const metadata: Metadata = {
  title: "inkspire",

  description: "book shop",
};

// Root layout for wrapping the app with global layout components
export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) 


{

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          {/* Header/Navbar */}
          <Navbar />

          {/* Main content */}
          <main>{children}</main>
  <ChatBot />
          {/* Footer */}
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );

}
