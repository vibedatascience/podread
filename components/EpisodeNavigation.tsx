import Link from 'next/link';

interface NavigationEpisode {
    slug: string;
    title: string;
    channel: string;
}

interface EpisodeNavigationProps {
    previousEpisode: NavigationEpisode | null;
    nextEpisode: NavigationEpisode | null;
}

export default function EpisodeNavigation({ previousEpisode, nextEpisode }: EpisodeNavigationProps) {
    if (!previousEpisode && !nextEpisode) return null;

    return (
        <nav className="border-t-2 border-black mt-16 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Previous Episode */}
                <div className={previousEpisode ? '' : 'invisible'}>
                    {previousEpisode && (
                        <Link
                            href={`/episode/${previousEpisode.slug}`}
                            className="group block p-4 border border-gray-200 hover:border-accent transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent">
                                    Previous
                                </span>
                            </div>
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent mb-1">
                                {previousEpisode.channel}
                            </div>
                            <div className="font-serif text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                                {previousEpisode.title}
                            </div>
                        </Link>
                    )}
                </div>

                {/* Next Episode */}
                <div className={nextEpisode ? '' : 'invisible'}>
                    {nextEpisode && (
                        <Link
                            href={`/episode/${nextEpisode.slug}`}
                            className="group block p-4 border border-gray-200 hover:border-accent transition-colors text-right"
                        >
                            <div className="flex items-center justify-end gap-2 mb-2">
                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent">
                                    Next
                                </span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent mb-1">
                                {nextEpisode.channel}
                            </div>
                            <div className="font-serif text-gray-900 group-hover:text-accent transition-colors line-clamp-2">
                                {nextEpisode.title}
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
