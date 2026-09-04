"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, Settings, Target, Menu, X } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Jobs", href: "/", icon: Briefcase },
    { name: "Saved Roles", href: "/roles", icon: Target },
    { name: "System Health", href: "/health", icon: Settings },
  ];

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 relative z-50">
      <div className="flex items-center space-x-2 shrink-0">
        <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4 text-accent" />
        </div>
        <span className="font-semibold tracking-tight text-primary">Job Intel</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center space-x-2 flex-1 justify-end">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
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

      {/* Mobile Menu Toggle */}
      <button
        className="sm:hidden p-2 -mr-2 text-secondary hover:text-primary transition-colors focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 border-b border-border bg-background shadow-lg sm:hidden flex flex-col p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors mb-1 last:mb-0",
                  isActive
                    ? "bg-surface-secondary text-primary"
                    : "text-secondary hover:text-primary hover:bg-surface-secondary/50"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
