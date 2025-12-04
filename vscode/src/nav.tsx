import { Input } from '@/components/ui/input';
import logo from './assets/mv-logo-white.png';
import { Search } from 'lucide-react';

export default function Nav() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <a className="hover:opacity-80 transition-opacity" href="https://metrovancouver.org/">
                <img src={logo} alt="Metro Vancouver" className="h-8" />
            </a>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 w-64 bg-secondary/50 border-border"
                />
            </div>
        </nav>
    )
}