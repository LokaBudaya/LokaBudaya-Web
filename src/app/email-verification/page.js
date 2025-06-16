"use client";

import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // gunakan yang benar di App Router

export default function EmailVerificationPage({ searchParams }) {
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const email = searchParams?.email ?? 'your@email.com'; // fallback

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage('');
        
        try {
            await signInWithEmailAndPassword(auth, email, 'temp');
            setMessage('Email verifikasi telah dikirim ulang!');
        } catch (error) {
            setMessage('Gagal mengirim ulang email verifikasi. Silakan coba lagi nanti.');
        } finally {
            setIsResending(false);
        }
    };

    const handleVerificationComplete = () => {
        router.push('/');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                
                <div className="space-y-2">
                    <p className="text-gray-600">We've sent a verification email to:</p>
                    <p className="text-blue-600 font-medium">{email}</p>
                </div>

                <p className="text-gray-500 text-sm">
                    Please check your email and click the verification link to continue.
                </p>

                {message && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {message}
                    </div>
                )}

                <div className="space-y-3">
                    <button 
                        onClick={handleVerificationComplete}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        I've Verified My Email
                    </button>

                    <button 
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </div>

                <button 
                    onClick={() => router.push('/login')}
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
