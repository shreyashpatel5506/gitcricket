import Script from 'next/script'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReferralWidget from '@/components/ReferralWidget';

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
    <head>
  <meta
    name="c2fda82fdea5dcfd0da917126c88c22bad6c9bc1"
    content="c2fda82fdea5dcfd0da917126c88c22bad6c9bc1"
  />
  
<meta name="referrer" content="no-referrer-when-downgrade" />
  <Script id="hilltopads" strategy="afterInteractive">
    {`
    (function(jbm){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = jbm || {};
s.src = "\/\/quarrelsomebitter.com\/byX\/VMsYd.GHli0nYnWjcH\/uefmw9\/ufZ-U\/lrkRPGTjcDy\/MjjGY\/wcNbTYc\/tPN\/zBI-yZNVjzA-2\/MIQe";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
    `}
  </Script>
  <Script id="hilltopads2" strategy="afterInteractive">{`(function(zchkt){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = zchkt || {};
s.src = "\/\/quarrelsomebitter.com\/b.X\/VGsTdiGLlR0HYEW-cT\/UeTm_9vuPZVUMlpkjPRTOcoyjM\/jiYjwHOUD\/E\/t\/NlzXI\/yzN\/jfAO4zNRQS";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`}
</Script>
</head>
      <body className="bg-bg-void text-text-primary min-h-full flex flex-col antialiased">
        {children}
        <ReferralWidget />
      </body>
    </html>
  );
}
