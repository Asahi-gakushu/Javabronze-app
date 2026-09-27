import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { adsenseClient, gaId, siteUrl } from "@/lib/monetization";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "Javabronze — Java Bronze 無料練習問題クイズ",
    template: "%s | Javabronze",
  },
  description:
    "Java Bronze（Oracle認定Javaブロンズ）対策の無料4択クイズ。解説付きで、スキマ時間にJavaの基礎を身につけよう。問題は毎週追加。",
  keywords: ["Java Bronze", "Javaブロンズ", "Java 練習問題", "Java 資格", "Java 入門", "Java クイズ"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Javabronze",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {adsenseClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        <header className="border-b border-bronze-light">
          <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span aria-hidden="true">☕</span>
              <span>
                Java<span className="text-bronze-dark">bronze</span>
              </span>
            </Link>
            <span className="text-sm opacity-70">初心者向けJavaクイズ</span>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-8">{children}</main>
        <footer className="border-t border-bronze-light">
          <div className="mx-auto max-w-4xl px-6 py-4 text-sm opacity-60">
            練習して、失敗して、また挑戦する。それがブロンズをシルバーに変える道。
            <span className="mt-1 block text-xs">
              当サイトは広告・アフィリエイトプログラムを利用しています。
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
