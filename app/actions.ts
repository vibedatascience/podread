'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Episode } from '@/types/episode';

const EPISODES_PER_PAGE = 10;
const SEARCH_RESULTS_PER_PAGE = 20;

async function loadEpisodes(): Promise<Episode[]> {
    const filePath = path.join(process.cwd(), 'data/episodes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function fetchChannelEpisodes(
    channelName: string,
    page: number
): Promise<Episode[]> {
    const allEpisodes = await loadEpisodes();

    // Filter by channel (case-insensitive for robustness, though data seems consistent)
    const channelEpisodes = allEpisodes.filter(
        (ep) => ep.channel.toLowerCase() === channelName.toLowerCase()
    );

    // Pagination logic
    const start = (page - 1) * EPISODES_PER_PAGE;
    const end = start + EPISODES_PER_PAGE;

    return channelEpisodes.slice(start, end);
}

export interface ChannelInfo {
    name: string;
    episodeCount: number;
    latestEpisode: string;
}

export async function fetchAllChannels(): Promise<ChannelInfo[]> {
    const allEpisodes = await loadEpisodes();

    const channelMap = new Map<string, { count: number; latest: string }>();

    for (const episode of allEpisodes) {
        const existing = channelMap.get(episode.channel);
        if (!existing) {
            channelMap.set(episode.channel, {
                count: 1,
                latest: episode.publishedAt
            });
        } else {
            existing.count++;
            // Compare dates to find latest
            if (episode.publishedAt > existing.latest) {
                existing.latest = episode.publishedAt;
            }
        }
    }

    const channels: ChannelInfo[] = Array.from(channelMap.entries()).map(([name, info]) => ({
        name,
        episodeCount: info.count,
        latestEpisode: info.latest
    }));

    // Sort by episode count (descending)
    channels.sort((a, b) => b.episodeCount - a.episodeCount);

    return channels;
}

export interface SearchResult {
    episodes: Episode[];
    total: number;
    hasMore: boolean;
}

export async function searchEpisodes(
    query: string,
    page: number = 1
): Promise<SearchResult> {
    if (!query.trim()) {
        return { episodes: [], total: 0, hasMore: false };
    }

    const allEpisodes = await loadEpisodes();
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const matchedEpisodes = allEpisodes.filter((episode) => {
        const searchableText = `${episode.title} ${episode.channel} ${episode.content}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
    });

    const start = (page - 1) * SEARCH_RESULTS_PER_PAGE;
    const end = start + SEARCH_RESULTS_PER_PAGE;

    return {
        episodes: matchedEpisodes.slice(start, end),
        total: matchedEpisodes.length,
        hasMore: end < matchedEpisodes.length
    };
}
