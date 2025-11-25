'use client';

import { useState, useEffect } from 'react';

interface TOCItem {
    id: string;
    text: string;
}

interface TableOfContentsProps {
    headings: TOCItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const top = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="border-l-2 border-gray-200 pl-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full mb-3 group"
                >
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent">
                        Contents
                    </span>
                    <svg
                        className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isExpanded && (
                    <ul className="space-y-1.5">
                        {headings.map(({ id, text }, index) => (
                            <li key={id}>
                                <button
                                    onClick={() => scrollToHeading(id)}
                                    className={`text-left text-xs font-serif leading-snug transition-colors w-full ${
                                        activeId === id
                                            ? 'text-accent font-medium'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    <span className="text-[9px] font-sans text-gray-400 mr-1">
                                        {index + 1}.
                                    </span>
                                    {text.length > 35 ? text.substring(0, 35) + '...' : text}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}
