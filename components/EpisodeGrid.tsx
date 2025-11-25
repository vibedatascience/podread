'use client';

import { useState, useCallback, useMemo } from 'react';
import { Episode } from '@/types/episode';
import EpisodeCardWithHistory from '@/components/EpisodeCardWithHistory';
import FilterSort from '@/components/FilterSort';

interface EpisodeGridProps {
    episodes: Episode[];
}

export default function EpisodeGrid({ episodes }: EpisodeGridProps) {
    const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>(episodes);

    const channels = useMemo(() => {
        const uniqueChannels = [...new Set(episodes.map(ep => ep.channel))];
        return uniqueChannels.sort();
    }, [episodes]);

    const handleFilter = useCallback((filtered: Episode[]) => {
        setFilteredEpisodes(filtered);
    }, []);

    return (
        <>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <FilterSort
                    episodes={episodes}
                    onFilter={handleFilter}
                    channels={channels}
                />
                <span className="text-[11px] font-sans text-gray-500">
                    {filteredEpisodes.length} episodes
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {filteredEpisodes.map((episode) => (
                    <EpisodeCardWithHistory key={episode.id} episode={episode} />
                ))}
            </div>

            {filteredEpisodes.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-serif">
                    No episodes found matching your criteria.
                </div>
            )}
        </>
    );
}
