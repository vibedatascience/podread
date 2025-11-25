import Link from 'next/link';
import Header from '@/app/components/Header';
import SubscribeButton from '@/components/SubscribeButton';
import ManageSubscriptionButton from '@/components/ManageSubscriptionButton';
import { auth } from '@/auth';

export default async function SubscribePage() {
    const session = await auth();
    return (
        <main className="min-h-screen bg-white border-t-4 border-accent">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 border-b-2 border-black pb-12">
                    <div className="inline-block w-16 h-1 bg-accent mb-6"></div>
                    <h1 className="text-5xl sm:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Subscribe to PodRead
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-serif leading-relaxed">
                        Unlock comprehensive visual notes and analysis from the world's best deep-tech and intellectual podcasts.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="max-w-md mx-auto mb-16">
                    <div className="border-2 border-black bg-white">
                        {/* Price Header */}
                        <div className="bg-gray-900 text-white p-6 text-center">
                            <div className="text-sm font-sans uppercase tracking-widest mb-2">Premium Access</div>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-5xl font-serif font-bold">$10</span>
                                <span className="text-lg font-sans text-gray-300">/month</span>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="p-8">
                            <h3 className="font-serif font-bold text-lg mb-6 text-gray-900">What's included:</h3>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0"></div>
                                    <span className="font-serif text-gray-700">Unlimited access to all premium episodes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0"></div>
                                    <span className="font-serif text-gray-700">Full AI-generated visual notes and analysis</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0"></div>
                                    <span className="font-serif text-gray-700">Read 3-hour episodes in 5 minutes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0"></div>
                                    <span className="font-serif text-gray-700">New episodes added regularly</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent mt-2 flex-shrink-0"></div>
                                    <span className="font-serif text-gray-700">Cancel anytime, no questions asked</span>
                                </li>
                            </ul>

                            {/* CTA Button */}
                            <SubscribeButton className="w-full bg-accent text-white font-sans font-bold text-xs uppercase tracking-widest py-4 px-6 hover:bg-red-700 transition-colors mb-3 disabled:opacity-50">
                                Subscribe Now
                            </SubscribeButton>
                            <p className="text-center text-xs font-sans text-gray-500">
                                Secure payment via Stripe • Cancel anytime
                            </p>
                        </div>
                    </div>

                    {/* Already subscribed link */}
                    <div className="text-center mt-6">
                        {session ? (
                            <ManageSubscriptionButton />
                        ) : (
                            <Link href="/api/auth/signin" className="text-sm font-sans text-gray-600 hover:text-accent underline">
                                Already a subscriber? Sign in
                            </Link>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-2xl mx-auto border-t-2 border-black pt-12">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-serif font-bold text-lg mb-2 text-gray-900">
                                What podcasts do you cover?
                            </h3>
                            <p className="font-serif text-gray-700 leading-relaxed">
                                We focus on deep-tech, intellectual, and long-form podcasts covering topics like AI, geopolitics,
                                technology, science, and culture. Our AI analyzes each episode to create comprehensive visual notes.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif font-bold text-lg mb-2 text-gray-900">
                                How does the subscription work?
                            </h3>
                            <p className="font-serif text-gray-700 leading-relaxed">
                                Your subscription is billed monthly at $10. You can cancel anytime from your account settings,
                                and you'll retain access until the end of your billing period.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif font-bold text-lg mb-2 text-gray-900">
                                What makes PodRead different?
                            </h3>
                            <p className="font-serif text-gray-700 leading-relaxed">
                                Unlike traditional show notes, our AI-generated analysis provides structured summaries, key quotes,
                                visual highlights, and comprehensive breakdowns that let you absorb hours of content in minutes.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif font-bold text-lg mb-2 text-gray-900">
                                Can I try before subscribing?
                            </h3>
                            <p className="font-serif text-gray-700 leading-relaxed">
                                Yes! All episodes less than one month old are available for free. Browse our library to see
                                the quality of our analysis before committing to a subscription.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-16 pt-12 border-t border-gray-200">
                    <p className="font-serif text-gray-600 mb-6">
                        Join readers who save hours every week
                    </p>
                    <SubscribeButton className="bg-accent text-white font-sans font-bold text-xs uppercase tracking-widest py-4 px-8 hover:bg-red-700 transition-colors disabled:opacity-50">
                        Get Started Today
                    </SubscribeButton>
                </div>
            </div>
        </main>
    );
}
