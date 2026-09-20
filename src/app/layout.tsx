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
  title: "Javabronze — Learn Java",
  description: "Bite-sized quizzes for building bronze-level Java fundamentals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
            <span className="text-sm opacity-70">Beginner Java quizzes</span>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-8">{children}</main>
        <footer className="border-t border-bronze-light">
          <div className="mx-auto max-w-4xl px-6 py-4 text-sm opacity-60">
            Practice. Fail. Try again. That&apos;s how bronze becomes silver.
          </div>
        </footer>
      </body>
    </html>
  );
}
