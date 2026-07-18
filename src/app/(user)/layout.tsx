import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, History, LayoutList, Send, SquareChartGantt, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Equipment",
  description: "Equipment",
};

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (session && session.user.role === 'admin') {
    redirect("/admin");
  }

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="h-screen flex flex-col overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          
          {/* Full-bleed layout container */}
          <div className="flex-1 flex w-full overflow-hidden mt-16">
            
            {/* Sidebar with fixed width, white background, and subtle border */}
            <aside className="hidden md:flex w-[260px] flex-col bg-white dark:bg-zinc-950 border-r py-6 px-4 shrink-0 gap-8 overflow-y-auto">
              
              <div className="flex flex-col gap-1">
                <h4 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Browse
                </h4>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/" className="flex gap-3 items-center">
                    <LayoutList className="w-4 h-4" /> Equipment
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  My Activity
                </h4>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/checkouts" className="flex gap-3 items-center">
                    <SquareChartGantt className="w-4 h-4" /> My Checkouts
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/requests" className="flex gap-3 items-center">
                    <Send className="w-4 h-4" /> My Requests
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/history" className="flex gap-3 items-center">
                    <History className="w-4 h-4" /> History
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Support
                </h4>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/reportDamage" className="flex gap-3 items-center">
                    <TriangleAlert className="w-4 h-4" /> Report Damage
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 h-9 px-3" asChild>
                  <Link href="/notifications" className="flex gap-3 items-center">
                     <Bell className="w-4 h-4" /> Notifications
                  </Link>
                </Button>
              </div>

            </aside>
            
            {/* Main content area with soft background */}
            <main className="flex-1 bg-[#F9FAFB] dark:bg-zinc-900/40 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                {children}
                <Toaster />
              </div>
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}