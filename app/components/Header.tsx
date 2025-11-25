import Link from 'next/link';
import AuthButton from '@/components/AuthButton';
import SearchBar from '@/components/SearchBar';

export default function Header() {
    return (
        <header className="bg-white sticky top-0 z-30">
            <div className="border-b border-black">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-accent w-10 h-10 flex items-center justify-center">
                            <span className="text-white font-serif font-bold text-2xl">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-2xl leading-none tracking-tight">PodRead</span>
                            <span className="font-sans text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Intelligence Audio</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden sm:block">
                            <SearchBar />
                        </div>
                        <AuthButton />
                        <Link href="/subscribe" className="hidden md:block">
                            <button className="bg-accent text-white text-[11px] font-sans font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-red-700 transition-colors">
                                Subscribe
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Mobile search bar */}
            <div className="sm:hidden border-b border-gray-200 px-4 py-2">
                <SearchBar />
            </div>
            <div className="border-b border-gray-200 h-1"></div>
        </header>
    );
}

