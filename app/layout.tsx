import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import HomeStage from "@/components/ui/HomeStage";
import SmoothScroll from "@/components/ui/SmoothScroll";

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
        {/* Everything fixed lives outside SmoothScroll — its content element is
            transformed, which would otherwise drag fixed children along. */}
        <CustomCursor />
        <Navbar />
        <HomeStage />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
