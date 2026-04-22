import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group relative rounded-full border border-blue-400 bg-background/80 text-blue-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-blue-400/40 dark:text-foreground/80 dark:hover:border-primary"
        >
          <Sun className="h-[1.05rem] w-[1.05rem] scale-100 rotate-0 transition-all duration-300 group-hover:scale-110 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.05rem] w-[1.05rem] scale-0 rotate-90 transition-all duration-300 group-hover:scale-110 dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border border-blue-300/60 bg-background/95 p-2 shadow-xl backdrop-blur-md dark:border-blue-400/30">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
