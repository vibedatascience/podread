'use client';

import { useState } from 'react';

interface SubscribeButtonProps {
    className?: string;
    children: React.ReactNode;
}

export default function SubscribeButton({ className, children }: SubscribeButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.error) {
                // If not logged in, redirect to sign in
                if (response.status === 401) {
                    window.location.href = '/api/auth/signin?callbackUrl=/subscribe';
                    return;
                }
                alert(data.error);
                return;
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className={className}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
}
