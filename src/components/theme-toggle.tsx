"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ label }: { label: string }): ReactElement {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return (
         <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0" aria-label={label} disabled>
            <Sun className="size-5 opacity-0" aria-hidden />
         </Button>
      );
   }

   const isDark = resolvedTheme === "dark";

   return (
      <Button
         type="button"
         variant="ghost"
         size="icon"
         className="size-9 shrink-0 text-zinc-700 hover:bg-zinc-200/80 dark:text-white dark:hover:bg-white/10"
         aria-label={label}
         aria-pressed={isDark}
         onClick={() => setTheme(isDark ? "light" : "dark")}
      >
         {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
      </Button>
   );
}
