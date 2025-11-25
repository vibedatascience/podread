import { fetchChannelEpisodes } from '@/app/actions';
import ChannelFeed from '@/components/ChannelFeed';
import Header from '@/app/components/Header';

interface PageProps {
    params: Promise<{ channelName: string }>;
}

export default async function ChannelPage({ params }: PageProps) {
    const { channelName } = await params;
    const decodedChannelName = decodeURIComponent(channelName);
    const initialEpisodes = await fetchChannelEpisodes(decodedChannelName, 1);

    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Hero / Lead */}
                <div className="mb-16 border-b-2 border-black pb-8 relative">
                    <div className="absolute top-0 left-0 w-16 h-1 bg-accent"></div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent mb-3 block pt-6">
                        Channel
                    </span>
                    <h1 className="text-6xl font-serif font-bold text-gray-900 mb-6 leading-none tracking-tight">
                        {decodedChannelName}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl font-serif leading-relaxed">
                        All episodes from {decodedChannelName}.
                    </p>
                </div>

                {/* Feed */}
                <ChannelFeed initialEpisodes={initialEpisodes} channelName={decodedChannelName} />
            </div>
        </main>
    );
}
