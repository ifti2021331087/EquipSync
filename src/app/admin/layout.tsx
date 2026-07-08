import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock5, Component, Flag, House, LayoutDashboard, LockKeyhole, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equipment",
  description: "Equipment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session || session.user.role!=='admin'){
        redirect("/");
    }

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="flex-1 flex mx-auto w-full max-w-7xl mt-20">
            <aside className="hidden md:flex w-64 flex-col border-r py-6 pr-6 gap-6">

              <div className="flex flex-col gap-2">
                <h4 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview
                </h4>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/" className="flex gap-2">
                    <LayoutDashboard/> Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/approval" className="flex gap-2">
                    <Clock5/> Approval
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/schedule" className="flex gap-2">
                    <CalendarCheck/> Schedule
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Inventory
                </h4>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/equipment" className="flex gap-2">
                    <Component/> Equipment
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/report" className="flex gap-2">
                    <Flag/> Damage Report
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  People
                </h4>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/members" className="flex gap-2">
                    <Users/> Members
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start w-full cursor-pointer">
                  <Link href="/admin/roles" className="flex gap-2">
                    <LockKeyhole/> Roles & access
                  </Link>
                </Button>
              </div>

            </aside>
            <main className="flex-1 p-6 md:p-8">
              {children}
              <Toaster />
            </main>

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}