"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Trophy, User, Settings } from "lucide-react";

interface BottomNavProps {
  isAdmin?: boolean;
}

export default function BottomNav({ isAdmin = false }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/buy", icon: ShoppingCart, label: "구매" },
    { href: "/results", icon: Trophy, label: "결과" },
    { href: "/profile", icon: User, label: "프로필" },
  ];

  if (isAdmin) {
    navItems.push({ href: "/admin", icon: Settings, label: "관리자" });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? "text-emerald-400"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
