'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Episode } from '@/types/episode';
import EpisodeCard from '@/components/EpisodeCard';
import { fetchChannelEpisodes } from '@/app/actions';

interface ChannelFeedProps {
    initialEpisodes: Episode[];
    channelName: string;
}

export default function ChannelFeed({
    initialEpisodes,
    channelName,
}: ChannelFeedProps) {
    const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
    const [page, setPage] = useState(2); // Start from page 2 since initial is page 1
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMoreEpisodes = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const newEpisodes = await fetchChannelEpisodes(channelName, page);
            if (newEpisodes.length === 0) {
                setHasMore(false);
            } else {
                setEpisodes((prev) => [...prev, ...newEpisodes]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Failed to load more episodes:', error);
        } finally {
            setLoading(false);
        }
    }, [channelName, page, loading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreEpisodes();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMoreEpisodes]);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {episodes.map((episode) => (
                    <EpisodeCard key={episode.id} episode={episode} />
                ))}
            </div>

            {/* Loading / End of Content Indicator */}
            <div ref={observerTarget} className="py-8 text-center">
                {loading && (
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                )}
                {!hasMore && episodes.length > 0 && (
                    <p className="text-gray-500 font-serif italic">End of content</p>
                )}
            </div>
        </div>
    );
}
