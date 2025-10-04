import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";


const kento = localFont({
  variable: "--font-kento",
  src: [
    {
      path: "../fonts/Kento Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Kento Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Kento Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

const suisseIntl = localFont({
  variable: "--font-suisse-intl",
  src: [
    {
      path: '../fonts/Suisse_Intl_Regular.ttf'
    }
  ]
})

export const metadata: Metadata = {
  title: "Cali Labz",
  description: "We offer consumers premium cannabis products and entrepreneurs the chance to run modern dispensaries in Spain. With quality and trust at our core, we serve both private customers and business partners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${suisseIntl.variable} ${kento.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
