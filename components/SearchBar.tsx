'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Episode } from '@/types/episode';
import { searchEpisodes } from '@/app/actions';
import Link from 'next/link';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Episode[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setTotal(0);
            return;
        }

        setLoading(true);
        try {
            const { episodes, total } = await searchEpisodes(searchQuery, 1);
            setResults(episodes.slice(0, 5)); // Show max 5 in dropdown
            setTotal(total);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={searchRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search episodes..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="w-48 md:w-64 px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans bg-white"
                />
                <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Dropdown Results */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((episode) => (
                                <Link
                                    key={episode.id}
                                    href={`/episode/${episode.slug}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                >
                                    <div className="text-[10px] font-sans font-bold tracking-widest uppercase text-accent mb-1">
                                        {episode.channel}
                                    </div>
                                    <div className="text-sm font-serif text-gray-900 line-clamp-2">
                                        {episode.title}
                                    </div>
                                </Link>
                            ))}
                            {total > 5 && (
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-center text-sm text-accent hover:bg-gray-50 font-sans"
                                >
                                    View all {total} results
                                </Link>
                            )}
                        </>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No episodes found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
