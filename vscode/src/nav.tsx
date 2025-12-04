import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Nav() {
    return (
        <nav className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
            <a 
                className="flex items-center hover:opacity-90 transition-opacity group" 
                href="https://metrovancouver.org/"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="text-[28px] font-bold tracking-tight text-foreground leading-none h-9 flex items-center transition-transform group-hover:scale-105">
                    Metro Vancouver
                </span>
            </a>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="pl-10 w-64 bg-background/50 border-border focus-visible:ring-2"
                />
            </div>
        </nav>
    )
}