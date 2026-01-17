'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Home, LineChart, LogOut, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useUser } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return user.displayName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Suivi migration", icon: LineChart, href: "/suivi-migration" },
    { name: "Clients", icon: Users, href: "/clients" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-3xl border shadow-sm h-12">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <span className="font-headline text-xs font-bold text-primary-foreground">M</span>
              </div>
              <span className="font-headline text-sm font-semibold hidden md:inline-block">Marque blanche</span>
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center gap-1 bg-card px-4 py-1.5 rounded-3xl border shadow-sm h-12">
            <nav className="flex items-center gap-4 lg:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 md:gap-3 bg-card px-3 py-1.5 rounded-3xl border shadow-sm h-12">
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un client..."
                className="h-8 w-[200px] lg:w-[250px] pl-9 bg-muted/50 border-none rounded-2xl focus-visible:ring-1"
              />
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-center h-10 w-10 cursor-pointer">
                    <Avatar className="h-8 w-8 border">
                      {user?.photoURL && <AvatarImage src={user.photoURL} alt="User avatar" />}
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('#')}>Profil</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('#')}>Facturation</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('#')}>Paramètres</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1">
        {children}
      </main>
    </div>
  );
}
