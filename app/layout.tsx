import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: "aiStudi - AI Study Assistant",
  description: "A premium AI-powered study assistant platform that converts notes into interactive study materials, flashcards, and quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen overflow-x-hidden">
            {/* Subtle background glow decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-zinc-200/20 dark:bg-zinc-800/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-zinc-200/20 dark:bg-zinc-800/10 blur-[120px] pointer-events-none" />

            <Header />
            <main className="flex-1 flex flex-col w-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" richColors theme="system" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
