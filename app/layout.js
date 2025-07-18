import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/main/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Movzilla - Download Hindi Dubbed & Dual Audio Movies in HD",
  description:
    "🎬 Welcome to MovzillaOfficial 🎬 | Watch and download dual audio, Hindi dubbed, and HD WebRip movies with fast direct downloads.",
  keywords: [
    "movzilla",
    "movzilla site",
    "movzilla movies",
    "dual audio movies",
    "hindi dubbed movies",
    "download 720p movies",
    "download 1080p movies",
    "latest movies",
    "movzillaofficial",
  ],
  metadataBase: new URL("https://movzilla.site"),
  openGraph: {
    title: "Movzilla - HD Movie Hub",
    description:
      "Stream & download Hindi Dubbed, Dual Audio, 720p, and 1080p movies with high speed links. Updated daily.",
    url: "https://movzilla.site",
    siteName: "Movzilla",
    images: [
      {
        url: "https://movzilla.site/og-image.jpg", // ← add in /public
        width: 1200,
        height: 630,
        alt: "Movzilla - Watch & Download HD Movies",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movzilla: Latest Hindi Dubbed & Dual Audio Movies",
    description:
      "Enjoy full HD movie downloads in Hindi, Dual Audio, WebRip 720p/1080p. Fast direct links. Daily updates.",
    site: "@movzillaofficial",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
