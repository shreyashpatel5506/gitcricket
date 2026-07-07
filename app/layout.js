import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: "GitCric — Turn Your GitHub Profile into a Cricket Player Card",
  description: "Transform your GitHub statistics (commits, issues, pull requests, streaks, stars) into high-performance, shareable cricket player cards with custom ratings and themes.",
  keywords: ["GitHub", "GitCric", "Cricket Player Card", "Developer Profile", "Commit Stats", "Portfolio Designer"],
  authors: [{ name: "GitCric Team" }],
  openGraph: {
    title: "GitCric — Turn Your GitHub Profile into a Cricket Player Card",
    description: "Convert your coding activity into cricket runs, wickets, and form streaks. Unlock premium card designs.",
    url: "https://gitcric.com",
    siteName: "GitCric",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="bg-bg-void text-text-primary min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
