"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music2, Library, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/generate", label: "生成", icon: Music2 },
  { href: "/library", label: "ライブラリ", icon: Library },
  { href: "/settings", label: "設定", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-card border-r border-border px-3 py-6">
      <div className="flex items-center gap-2 px-3 mb-8">
        <Music2 className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg">Music Gen</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 mb-3">
        <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
      </div>

      <button
        onClick={() => signOut({ redirectUrl: "/login" })}
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <LogOut className="w-4 h-4" />
        ログアウト
      </button>
    </aside>
  );
}
