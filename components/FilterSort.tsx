'use client';

import { useState, useEffect } from 'react';
import { Episode } from '@/types/episode';

interface FilterSortProps {
    episodes: Episode[];
    onFilter: (filtered: Episode[]) => void;
    channels: string[];
}

export default function FilterSort({ episodes, onFilter, channels }: FilterSortProps) {
    const [selectedChannel, setSelectedChannel] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        let filtered = [...episodes];

        // Filter by channel
        if (selectedChannel !== 'all') {
            filtered = filtered.filter(ep => ep.channel === selectedChannel);
        }

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        onFilter(filtered);
    }, [selectedChannel, sortBy, episodes, onFilter]);

    return (
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-sans">
            <div className="flex items-center gap-2">
                <label className="text-gray-500 uppercase tracking-wider">Channel:</label>
                <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="border border-gray-300 px-2 py-1 text-gray-700 bg-white focus:outline-none focus:border-accent"
                >
                    <option value="all">All Channels</option>
                    {channels.map(channel => (
                        <option key={channel} value={channel}>{channel}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-gray-500 uppercase tracking-wider">Sort:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                    className="border border-gray-300 px-2 py-1 text-gray-700 bg-white focus:outline-none focus:border-accent"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {selectedChannel !== 'all' && (
                <button
                    onClick={() => setSelectedChannel('all')}
                    className="text-accent hover:text-red-700 transition-colors"
                >
                    Clear filter
                </button>
            )}
        </div>
    );
}
