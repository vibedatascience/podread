'use client';

import { useBookmarks } from '@/lib/hooks';

interface BookmarkButtonProps {
    slug: string;
    className?: string;
}

export default function BookmarkButton({ slug, className = '' }: BookmarkButtonProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const bookmarked = isBookmarked(slug);

    return (
        <button
            onClick={() => toggleBookmark(slug)}
            className={`flex items-center gap-1 text-[11px] font-sans text-gray-500 hover:text-accent transition-colors ${className}`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark for later'}
        >
            <svg
                className="w-4 h-4"
                fill={bookmarked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={bookmarked ? 0 : 2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
            <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Save'}</span>
        </button>
    );
}
