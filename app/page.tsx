import { promises as fs } from 'fs';
import path from 'path';
import { Episode } from '@/types/episode';
import Header from '@/app/components/Header';
import EpisodeGrid from '@/components/EpisodeGrid';

async function getEpisodes(): Promise<Episode[]> {
    const filePath = path.join(process.cwd(), 'data/episodes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const episodes: Episode[] = JSON.parse(fileContents);
    return episodes.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export default async function Home() {
    const episodes = await getEpisodes();

    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            {/* Masthead */}
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Hero / Lead */}
                <div className="mb-16 border-b-2 border-black pb-8 relative">
                    <div className="absolute top-0 left-0 w-16 h-1 bg-accent"></div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-3 block pt-6">
                        Briefing
                    </span>
                    <h1 className="text-6xl font-serif font-bold text-gray-900 mb-6 leading-none tracking-tight">
                        Visual notes for your ears.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl font-serif leading-relaxed">
                        Comprehensive summaries and insights from the world's best deep-tech and intellectual podcasts.
                        Read a 3-hour episode in 5 minutes.
                    </p>
                </div>

                {/* Episode Grid with Filter/Sort */}
                <EpisodeGrid episodes={episodes} />
            </div>
        </main>
    );
}
