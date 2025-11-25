import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Episode } from '@/types/episode';
import { isAdmin } from '@/lib/auth';
import { processMarkdown } from '@/lib/markdown';
import { calculateReadingTime, extractHeadings } from '@/lib/utils';
import { Metadata } from 'next';

import Header from '@/app/components/Header';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import TableOfContents from '@/components/TableOfContents';
import EpisodeNavigation from '@/components/EpisodeNavigation';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import ReadingTracker from '@/components/ReadingTracker';

interface EpisodeWithNav {
    episode: Episode | undefined;
    previousEpisode: { slug: string; title: string; channel: string } | null;
    nextEpisode: { slug: string; title: string; channel: string } | null;
}

async function getEpisodeWithNav(slug: string): Promise<EpisodeWithNav> {
    const filePath = path.join(process.cwd(), 'data/episodes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const episodes: Episode[] = JSON.parse(fileContents);

    const currentIndex = episodes.findIndex((ep) => ep.slug === slug);
    const episode = currentIndex !== -1 ? episodes[currentIndex] : undefined;

    // Get previous and next episodes (episodes are sorted newest first)
    const previousEpisode = currentIndex > 0
        ? { slug: episodes[currentIndex - 1].slug, title: episodes[currentIndex - 1].title, channel: episodes[currentIndex - 1].channel }
        : null;
    const nextEpisode = currentIndex < episodes.length - 1 && currentIndex !== -1
        ? { slug: episodes[currentIndex + 1].slug, title: episodes[currentIndex + 1].title, channel: episodes[currentIndex + 1].channel }
        : null;

    return { episode, previousEpisode, nextEpisode };
}

async function getEpisode(slug: string): Promise<Episode | undefined> {
    const filePath = path.join(process.cwd(), 'data/episodes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const episodes: Episode[] = JSON.parse(fileContents);
    return episodes.find((ep) => ep.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const episode = await getEpisode(slug);

    if (!episode) {
        return {
            title: 'Episode Not Found | PodRead',
        };
    }

    return {
        title: `${episode.title} | PodRead`,
        description: `Visual notes and analysis for ${episode.title} from ${episode.channel}. Read the summary in 5 minutes.`,
    };
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { episode, previousEpisode, nextEpisode } = await getEpisodeWithNav(slug);
    const admin = await isAdmin();

    if (!episode) {
        return <div className="p-8 text-center text-sm font-serif">Episode not found</div>;
    }

    // Process markdown content
    const processedContent = await processMarkdown(episode.content || '');

    // Calculate reading time and extract headings
    const readingTime = calculateReadingTime(episode.content || '');
    const headings = extractHeadings(episode.content || '');

    // Better Teaser Logic: Take first 3 paragraphs to ensure valid markdown/HTML structure
    // This avoids cutting off in the middle of a tag or sentence
    const teaserText = episode.content
        ? episode.content.split('\n\n').slice(0, 3).join('\n\n')
        : "";
    const processedTeaser = await processMarkdown(teaserText);

    return (
        <div className="min-h-screen bg-white border-t-4 border-accent">
            <ReadingProgressBar />
            <Header />

            {/* Table of Contents - Fixed Sidebar */}
            {!episode.isPremium || admin ? (
                <TableOfContents headings={headings} />
            ) : null}

            <article className="max-w-[900px] mx-auto px-4 py-12 xl:mr-72">
                {/* Article Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-4 pb-1 border-b border-black">
                        <Link
                            href={`/channel/${encodeURIComponent(episode.channel)}`}
                            className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent hover:text-red-700"
                        >
                            {episode.channel}
                        </Link>
                        <Link href="/" className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 hover:text-accent">
                            ← Index
                        </Link>
                    </div>

                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 leading-[1.1]">
                        {episode.title}
                    </h1>

                    <div className="flex items-center flex-wrap gap-3 text-[11px] font-sans text-gray-500">
                        <span className="text-gray-900 font-bold">{episode.publishedAt}</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>{episode.duration}</span>
                        {episode.views && (
                            <>
                                <span className="w-px h-3 bg-gray-300"></span>
                                <span>{episode.views} views</span>
                            </>
                        )}
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {readingTime} min read
                        </span>
                    </div>

                    {/* Actions: Bookmark, Share, Watch Original */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <BookmarkButton slug={episode.slug} />
                        <ShareButtons title={episode.title} slug={episode.slug} />
                        {episode.url && (
                            <a
                                href={episode.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[11px] font-sans text-gray-500 hover:text-accent transition-colors ml-auto"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                <span className="hidden sm:inline">Watch original</span>
                            </a>
                        )}
                    </div>
                </header>

                {/* Reading tracker - marks as read after 10s */}
                <ReadingTracker slug={episode.slug} />

                {/* Content Area */}
                <div className="prose prose-lg max-w-none font-serif">
                    <div className="first-letter:float-left first-letter:text-[3.5rem] first-letter:leading-[0.85] first-letter:font-bold first-letter:mr-2 first-letter:mt-[-2px] first-letter:font-serif">
                    </div>

                    {episode.isPremium && !admin ? (
                        <div>
                            {/* Visible Teaser */}
                            <div className="mb-8 opacity-100" dangerouslySetInnerHTML={{ __html: processedTeaser }} />

                            {/* Paywall Overlay */}
                            <div className="relative mt-8">
                                <div className="absolute inset-0 -top-24 bg-gradient-to-b from-white/0 via-white/90 to-white z-10" />

                                <div className="relative z-20 bg-gray-50 border-y border-black p-8 text-center mx-auto max-w-md my-8">
                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
                                        Read the full analysis
                                    </h3>
                                    <p className="font-serif text-sm text-gray-600 mb-6">
                                        Subscribe to unlock comprehensive visual notes for this episode and our entire deep-tech library.
                                    </p>
                                    <Link href="/subscribe">
                                        <button className="w-full bg-accent text-white font-sans font-bold text-[11px] uppercase tracking-widest py-3 px-6 hover:bg-red-700 transition-colors">
                                            Subscribe today — $10/mo
                                        </button>
                                    </Link>
                                    <p className="text-[9px] font-sans text-gray-500 mt-3">
                                        Cancel anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                    )}
                </div>

                {/* Previous/Next Navigation */}
                <EpisodeNavigation
                    previousEpisode={previousEpisode}
                    nextEpisode={nextEpisode}
                />
            </article>
        </div>
    );
}
