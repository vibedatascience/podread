import { searchEpisodes } from '@/app/actions';
import Header from '@/app/components/Header';
import EpisodeCard from '@/components/EpisodeCard';
import SearchResults from './SearchResults';

interface PageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
    const { q: query } = await searchParams;
    const decodedQuery = query ? decodeURIComponent(query) : '';

    const initialResults = decodedQuery
        ? await searchEpisodes(decodedQuery, 1)
        : { episodes: [], total: 0, hasMore: false };

    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Hero / Lead */}
                <div className="mb-16 border-b-2 border-black pb-8 relative">
                    <div className="absolute top-0 left-0 w-16 h-1 bg-accent"></div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-3 block pt-6">
                        Search Results
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-none tracking-tight">
                        {decodedQuery ? `"${decodedQuery}"` : 'Search'}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl font-serif leading-relaxed">
                        {initialResults.total > 0
                            ? `Found ${initialResults.total} episode${initialResults.total === 1 ? '' : 's'}`
                            : decodedQuery
                                ? 'No episodes found matching your search.'
                                : 'Enter a search term to find episodes.'
                        }
                    </p>
                </div>

                {/* Results */}
                {decodedQuery && initialResults.episodes.length > 0 ? (
                    <SearchResults
                        initialEpisodes={initialResults.episodes}
                        query={decodedQuery}
                        total={initialResults.total}
                        initialHasMore={initialResults.hasMore}
                    />
                ) : decodedQuery ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 font-serif text-lg">
                            Try searching for a different term or browse channels.
                        </p>
                    </div>
                ) : null}
            </div>
        </main>
    );
}
