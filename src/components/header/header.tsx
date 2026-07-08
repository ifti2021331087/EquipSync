"use client";

import {
  MessageCircleQuestionMark,
  MenuIcon,
  Home,
  PlusCircle,
  UserIcon,
  Bell,
  LayoutDashboard,
  FileText,
  Users
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ModeToggle } from "../theme/moodToogle";
import Image from "next/image";
import UserMenu from "../auth/user-menu";
import { cn } from "@/lib/utils";


export default function Header() {
  const { data: session, isPending } = useSession()
  const user = session?.user;
  const isAdmin = user?.role === 'admin';
  const pathName = usePathname();
  const isAuthPage: boolean = (pathName === "/auth/signIn") || (pathName === "/auth/signUp");

  if (isAuthPage) return null;

  // Helper to check if link is active
  const isActive = (path: string) => pathName === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">

        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <Link href={"/"} className="flex gap-2 items-center">
            <Image src={"mechanical-engineering.svg"} width={20} height={20} alt="home"></Image>
            <span className="font-bold text-xl text-black dark:text-white hover:opacity-80 transition-opacity">
              Equipment
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Hidden on Mobile) */}
        {/* <nav className="hidden md:flex items-center gap-6">
          {
            !isPending && !isAdmin && (
              <>
                <Link href={"/"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Feed
                </Link>
                <Link href={"/ask"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/ask') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Ask
                </Link>
                <Link href={"/profile"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/profile') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Profile
                </Link>
                <Link href={"/notifications"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/notifications') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Notifications
                </Link>
              </>
            )
          }
          {
            !isPending && isAdmin && (
              <>
                <Link href={"/"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Home
                </Link>
                <Link href={"/admin/dashboard"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/admin/dashboard') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Dashboard
                </Link>
                <Link href={"/admin/post"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/admin/post') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Posts
                </Link>
                <Link href={"/admin/user"} className={`font-medium text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isActive('/admin/user') ? 'text-blue-600 dark:text-blue-500' : 'text-muted-foreground'}`}>
                  Users
                </Link>
              </>
            )
          }
        </nav> */}

        {/* Right Side: Profile Dropdown (Desktop) & Hamburger Menu (Mobile) */}
        <div className="flex items-center gap-3">

          <ModeToggle></ModeToggle>
          {/* Profile Dropdown */}
          <UserMenu></UserMenu>

          {/* Mobile Menu Drawer (Hidden on Desktop) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")}
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <MessageCircleQuestionMark className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-500 font-bold tracking-wide">Enquiry</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-2 flex-1">
                  {
                    !isPending && !isAdmin && (
                      <>
                        <SheetClose>
                          <Link href={"/"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <Home className="w-4 h-4" /> Feed
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/ask"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/ask') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <PlusCircle className="w-4 h-4" /> Ask
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/profile"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/profile') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <UserIcon className="w-4 h-4" /> Profile
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/notifications"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/notifications') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <Bell className="w-4 h-4" /> Notifications
                          </Link>
                        </SheetClose>
                      </>
                    )
                  }
                  {
                    !isPending && isAdmin && (
                      <>
                        <SheetClose>
                          <Link href={"/"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <Home className="w-4 h-4" /> Home
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/admin/dashboard"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/admin/post"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/admin/post') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <FileText className="w-4 h-4" /> Posts
                          </Link>
                        </SheetClose>
                        <SheetClose>
                          <Link href={"/admin/user"} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isActive('/admin/user') ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            <Users className="w-4 h-4" /> Users
                          </Link>
                        </SheetClose>
                      </>
                    )
                  }
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}