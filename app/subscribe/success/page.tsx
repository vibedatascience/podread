import Link from 'next/link';
import Header from '@/app/components/Header';

export default function SubscriptionSuccessPage() {
    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            <Header />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        Welcome to PodRead!
                    </h1>
                    <p className="text-xl text-gray-600 font-serif">
                        Your subscription is now active. You have full access to all premium content.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block bg-accent text-white font-sans font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-red-700 transition-colors"
                    >
                        Start Reading
                    </Link>
                    <p className="text-sm text-gray-500 font-sans">
                        A confirmation email has been sent to your inbox.
                    </p>
                </div>
            </div>
        </main>
    );
}
