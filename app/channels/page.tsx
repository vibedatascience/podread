import { fetchAllChannels } from '@/app/actions';
import Header from '@/app/components/Header';
import Link from 'next/link';

export default async function ChannelsPage() {
    const channels = await fetchAllChannels();

    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Hero / Lead */}
                <div className="mb-16 border-b-2 border-black pb-8 relative">
                    <div className="absolute top-0 left-0 w-16 h-1 bg-accent"></div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-3 block pt-6">
                        Browse
                    </span>
                    <h1 className="text-6xl font-serif font-bold text-gray-900 mb-6 leading-none tracking-tight">
                        All Channels
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl font-serif leading-relaxed">
                        Explore {channels.length} channels with curated podcast summaries.
                    </p>
                </div>

                {/* Channel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map((channel) => (
                        <Link
                            key={channel.name}
                            href={`/channel/${encodeURIComponent(channel.name)}`}
                            className="group block"
                        >
                            <article className="p-6 border border-gray-200 hover:border-accent transition-colors relative">
                                {/* Red accent on hover */}
                                <div className="absolute top-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300" />

                                <h2 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors">
                                    {channel.name}
                                </h2>

                                <div className="flex items-center gap-4 text-sm text-gray-500 font-sans">
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                        {channel.episodeCount} episode{channel.episodeCount === 1 ? '' : 's'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {channel.latestEpisode}
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
