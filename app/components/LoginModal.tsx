'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                setPassword('');
                onClose();
                router.refresh();
                // Also reload the page to ensure server-side admin check works
                window.location.reload();
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div 
                className="bg-white border-2 border-black p-8 max-w-md w-full mx-4 shadow-none"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-serif font-bold text-2xl text-gray-900 mb-4">
                    Admin Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-sans font-bold uppercase tracking-widest text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-gray-300 px-4 py-2 font-serif focus:outline-none focus:border-accent"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-accent font-sans">{error}</p>
                    )}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-accent text-white font-sans font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-300 text-gray-900 font-sans font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 hover:border-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

