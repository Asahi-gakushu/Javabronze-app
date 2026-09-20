import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Javabronze — Javaを学ぼう",
  description: "ブロンズレベルのJavaの基礎を身につけるための、短時間クイズ。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
          </div>
        </footer>
      </body>
    </html>
  );
}
