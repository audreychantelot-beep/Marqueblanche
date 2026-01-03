'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Home, LineChart, LogOut, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/auth');
  };

  const navItems = [
    { name: "Dashboard", icon: Home, href: "#", active: true },
    { name: "Suivi migration", icon: LineChart, href: "#" },
    { name: "Clients", icon: Users, href: "#" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex h-16 items-center gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mr-auto bg-card px-3 py-1.5 rounded-3xl border shadow-sm h-12">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="font-headline text-xs font-bold text-primary-foreground">M</span>
            </div>
            <span className="font-headline text-sm font-semibold hidden md:inline-block">Marque blanche</span>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {/* Navigation Section */}
            <div className="flex items-center gap-1 bg-card px-4 py-1.5 rounded-3xl border shadow-sm h-12">
              <nav className="flex items-center gap-4 lg:gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      item.active ? "text-primary" : "text-muted-foreground"
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
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" data-ai-hint={userAvatar.imageHint} />}
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
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
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Here's a snapshot of your business.</p>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <span className="text-muted-foreground">$</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <LineChart className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A log of recent activities in your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
