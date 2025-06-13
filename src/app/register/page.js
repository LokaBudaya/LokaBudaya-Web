"use client";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';

import { 
    createUserWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { 
    doc, 
    setDoc,
    getDoc,
} from 'firebase/firestore';

export default function RegisterPage({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const router = useRouter();

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');
        
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Check apakah user sudah ada di Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) {
                // Buat data user baru di Firestore
                await setDoc(userDocRef, {
                    createdAt: new Date(),
                    email: user.email,
                    emailVerified: user.emailVerified,
                    isEmailVerified: user.emailVerified,
                    profile: {
                        displayname: user.displayName || user.email.split('@')[0],
                        phonenumber: "",
                        username: user.email.split('@')[0]
                    },
                    role: 'user',
                    uid: user.uid,
                    username: user.email.split('@')[0]
                });
            }
            
            navigate('home');
        } catch (error) {
            console.error('Google sign-up error:', error);
            setError('Gagal mendaftar dengan Google. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        
        if (!agreeTerms) {
            setError('Anda harus menyetujui Terms of Service dan Privacy Policy');
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await sendEmailVerification(user);
            
            await setDoc(doc(db, "users", user.uid), {
                createdAt: new Date(),
                email: email,
                emailVerified: false,
                isEmailVerified: false,
                profile: {
                    displayname: username,
                    phonenumber: "",
                    username: username.toLowerCase().replace(/\s+/g, '')
                },
                role: 'user',
                uid: user.uid,
                username: username.toLowerCase().replace(/\s+/g, '')
            });

            await signOut(auth);
            setUserEmail(email);
            setShowVerification(true);

        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Email sudah terdaftar. Silakan gunakan email lain.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password terlalu lemah. Minimal 6 karakter.');
            } else {
                setError('Gagal mendaftar. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (showVerification) {
        return <EmailVerificationPage email={userEmail} navigate={navigate} />;
    }

    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {/* Logo */}
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        <Image 
                            src="/images/logo_main.png" 
                            alt="LokaBudaya Logo" 
                            width={72}
                            height={72}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
                    <p className="text-gray-600 mt-2">Please fill the form below to create an account</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</p>}

                {/* Google Sign-up Button */}
                <button 
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Signing up...' : 'Sign up with Google'}
                </button>

                {/* Facebook Sign-up Button */}
                <button 
                    disabled
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Sign up with Facebook
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailRegister} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            placeholder="Username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    
                    <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" 
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !agreeTerms}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Already have an account? <button onClick={() => router.push('/login')} className="font-medium text-blue-600 hover:underline">Sign In</button>
                </p>
            </div>
        </div>
    );
}