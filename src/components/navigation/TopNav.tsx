"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Settings, Target } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Jobs", href: "/", icon: Briefcase },
    { name: "Saved Roles", href: "/roles", icon: Target },
    { name: "System Health", href: "/health", icon: Settings },
  ];

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 sm:px-6">
      <div className="flex items-center space-x-2 mr-8">
        <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-accent" />
        </div>
        <span className="font-semibold tracking-tight text-primary">Job Intel</span>
      </div>

      <nav className="flex items-center space-x-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-secondary text-primary"
                  : "text-secondary hover:text-primary hover:bg-surface-secondary/50"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
