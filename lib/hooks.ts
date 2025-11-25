'use client';

import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'podread_bookmarks';
const HISTORY_KEY = 'podread_history';

// Bookmarks hook
export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(BOOKMARKS_KEY);
        if (stored) {
            setBookmarks(JSON.parse(stored));
        }
    }, []);

    const toggleBookmark = useCallback((slug: string) => {
        setBookmarks(prev => {
            const updated = prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug];
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isBookmarked = useCallback((slug: string) => {
        return bookmarks.includes(slug);
    }, [bookmarks]);

    return { bookmarks, toggleBookmark, isBookmarked };
}

// Reading history hook
export function useReadingHistory() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    const markAsRead = useCallback((slug: string) => {
        setHistory(prev => {
            if (prev.includes(slug)) return prev;
            const updated = [slug, ...prev].slice(0, 100); // Keep last 100
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isRead = useCallback((slug: string) => {
        return history.includes(slug);
    }, [history]);

    return { history, markAsRead, isRead };
}
