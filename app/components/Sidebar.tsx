'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import episodesData from '@/data/episodes.json';
import { Episode } from '@/types/episode';

export default function Sidebar() {
    const pathname = usePathname();
    const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Group episodes by channel
    const channels: Record<string, Episode[]> = {};
    episodesData.forEach((ep) => {
        if (!channels[ep.channel]) {
            channels[ep.channel] = [];
        }
        channels[ep.channel].push(ep as Episode);
    });

    const toggleChannel = (channel: string) => {
        setExpandedChannels((prev) => ({
            ...prev,
            [channel]: !prev[channel],
        }));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                className={`fixed top-4 left-4 z-50 p-2 bg-white border border-black shadow-none md:hidden ${isMobileMenuOpen ? 'hidden' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21" stroke="black" strokeWidth="2" strokeLinecap="square" />
                    <path d="M3 6H21" stroke="black" strokeWidth="2" strokeLinecap="square" />
                    <path d="M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="square" />
                </svg>
            </button>

            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen md:flex md:flex-col ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="px-6 py-6 border-b border-black flex-shrink-0">
                    <Link href="/" className="block group">
                        <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight group-hover:text-accent transition-colors">
                            PodRead
                        </h1>
                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 mt-1">
                            The Index
                        </p>
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="px-6 py-3 border-b border-gray-100">
                    <Link
                        href="/channels"
                        className={`flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-widest transition-colors ${
                            pathname === '/channels'
                                ? 'text-accent'
                                : 'text-gray-600 hover:text-accent'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        All Channels
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    {Object.entries(channels).map(([channelName, episodes]) => {
                        const isExpanded = expandedChannels[channelName];

                        return (
                            <div key={channelName} className="border-b border-gray-100 last:border-b-0">
                                <button
                                    onClick={() => toggleChannel(channelName)}
                                    className="w-full text-left px-6 py-3 group flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[11px] font-sans font-bold text-gray-900 uppercase tracking-widest group-hover:text-accent">
                                        {channelName}
                                    </span>
                                    <span
                                        className={`text-[8px] text-gray-400 transition-transform duration-200 ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="pb-2">
                                        {episodes.map((ep) => {
                                            const isActive = pathname === `/episode/${ep.slug}`;
                                            return (
                                                <Link
                                                    key={ep.id}
                                                    href={`/episode/${ep.slug}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`block px-6 py-2 pl-8 border-l-[3px] transition-all duration-200 ${
                                                        isActive
                                                            ? 'border-accent bg-gray-50'
                                                            : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className={`font-serif text-[13px] leading-snug ${
                                                        isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'
                                                    }`}>
                                                        {ep.title}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                    <a
                        href="https://buymeacoffee.com/rahulxc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-600 hover:text-accent transition-colors border border-gray-300 py-3 bg-white hover:border-accent"
                    >
                        <span>Support PodRead</span>
                    </a>
                </div>
            </aside>
        </>
    );
}
