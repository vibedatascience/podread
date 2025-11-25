import Link from 'next/link';
import { Episode } from '@/types/episode';

interface EpisodeCardProps {
    episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
    return (
        <article className="group h-full flex flex-col pt-3 border-t border-gray-300 hover:border-accent transition-colors relative">
            {/* Red "Fly" on hover */}
            <div className="absolute top-[-1px] left-0 w-8 h-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Channel / Kicker */}
            <div className="flex items-center justify-between mb-1.5 relative z-10">
                <Link
                    href={`/channel/${encodeURIComponent(episode.channel)}`}
                    className="text-[10px] font-sans font-bold tracking-widest uppercase text-red-600 hover:text-red-800 transition-colors"
                >
                    {episode.channel}
                </Link>
                {episode.isPremium && (
                    <span className="text-[9px] font-sans font-medium bg-gray-100 px-1.5 py-0.5 text-gray-600">
                        Subscriber only
                    </span>
                )}
            </div>

            {/* Main Card Link */}
            <Link href={`/episode/${episode.slug}`} className="flex flex-col flex-grow group-hover:text-accent transition-colors">
                {/* Headline */}
                <h2 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-accent transition-colors mb-2">
                    {episode.title}
                </h2>

                {/* Teaser / Metadata */}
                <div className="mt-auto pt-2 text-[11px] text-gray-500 font-sans flex items-center gap-2">
                    <span>{episode.publishedAt}</span>
                    <span className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                    <span>{episode.duration}</span>
                </div>
            </Link>
        </article>
    );
}
