'use client';

import { useEffect } from 'react';
import { useReadingHistory } from '@/lib/hooks';

interface ReadingTrackerProps {
    slug: string;
}

export default function ReadingTracker({ slug }: ReadingTrackerProps) {
    const { markAsRead } = useReadingHistory();

    useEffect(() => {
        // Mark as read after 10 seconds on the page
        const timer = setTimeout(() => {
            markAsRead(slug);
        }, 10000);

        return () => clearTimeout(timer);
    }, [slug, markAsRead]);

    return null;
}
