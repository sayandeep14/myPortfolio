import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Sayandeep Giri",
  description:
    "Engineer at Wells Fargo, CS graduate from Jadavpur University, music producer, and creator.",
  openGraph: {
    title: "Sayandeep Giri",
    description: "Engineer · Music Producer · Creator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
