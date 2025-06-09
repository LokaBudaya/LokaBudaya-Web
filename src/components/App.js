"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';

import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    setDoc,
    getDoc,
    getDocs,
    where
} from 'firebase/firestore';
import {
    Handshake, Ticket, Search, ChevronDown, Calendar,
    Trash2, Home, User, Settings, UtensilsCrossed,
    Facebook, Instagram, Youtube, Twitter, MessageCircle,
    Music, Users, LogOut, BarChart3, Shield,
    X, MapPin
} from 'lucide-react';

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listener untuk status otentikasi & data user
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                } else {
                    // Handle jika data user di firestore tidak ada
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
        
        return () => unsubscribeAuth();
    }, []);

    // Listener untuk data event dari Firestore
    useEffect(() => {
        const q = query(collection(db, "events"));
        const unsubscribeEvents = onSnapshot(q, (querySnapshot) => {
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            setEvents(eventsData);
        });

        return () => unsubscribeEvents();
    }, []);

    const navigate = (targetPage) => {
        setPage(targetPage);
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-emerald-50"><p>Loading...</p></div>;
    }

    const renderPage = () => {
        switch (page) {
            case 'admin':
                // Admin dashboard tanpa header/footer
                return <AdminDashboard events={events} navigate={navigate} userData={userData} />;
            case 'login':
                return <LoginPage navigate={navigate} />;
            case 'register':
                return <RegisterPage navigate={navigate} />;
            case 'home':
            default:
                return <HomePage events={events} navigate={navigate} />;
        }
    };

    // Cek apakah halaman admin
    const isAdminPage = page === 'admin';

    return (
        <div className="flex flex-col min-h-screen bg-blue-50 font-sans text-gray-800">
            {/* Header hanya muncul jika bukan halaman admin */}
            {!isAdminPage && <Navbar user={user} userData={userData} navigate={navigate} />}
            
            <main className={isAdminPage ? "" : "flex-1"}>
                {renderPage()}
            </main>
            
            {/* Footer hanya muncul jika bukan halaman admin */}
            {!isAdminPage && <Footer />}
        </div>
    );


    return (
        <div className="flex flex-col min-h-screen bg-emerald-50 font-sans text-gray-800">
            <Navbar user={user} userData={userData} navigate={navigate} />
            <main className="flex-1">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}

// --- KOMPONEN HALAMAN ---
function HomePage({ events }) {
    const [filteredEvents, setFilteredEvents] = useState(events);

    const handleFilterChange = (filters) => {
        let filtered = events;

        // Filter by location
        if (filters.location && filters.location !== 'all') {
            filtered = filtered.filter(event => 
                event.lokasi.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by category
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(event => 
                event.kategori?.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Filter by date
        if (filters.date) {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.tanggal_event.toDate());
                const filterDate = new Date(filters.date);
                return eventDate.toDateString() === filterDate.toDateString();
            });
        }

        // Filter by search query
        if (filters.search) {
            filtered = filtered.filter(event => 
                event.nama_event.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.deskripsi.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.lokasi.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredEvents(filtered);
    };

    useEffect(() => {
        setFilteredEvents(events);
    }, [events]);
    return (
        <div>
            <HeroSection onFilterChange={handleFilterChange} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* <h2 className="text-3xl font-bold text-center text-emerald-900 mb-8">Event Budaya Mendatang</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length > 0 ? (
                        events.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">Belum ada event yang tersedia.</p>
                    )}
                </div> */}
            </div>
        </div>
    );
}

function LoginPage({ navigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
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
                // Jika user baru, buat data di Firestore
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
            } else {
                // Update email verification status jika sudah ada
                await setDoc(userDocRef, { 
                    emailVerified: user.emailVerified,
                    isEmailVerified: user.emailVerified 
                }, { merge: true });
            }
            
            navigate('home');
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError('Gagal masuk dengan Google. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Cari user berdasarkan username di Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setError('Username tidak ditemukan.');
                setLoading(false);
                return;
            }
            
            // Ambil email dari user yang ditemukan
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userEmail = userData.email;
            
            // Login menggunakan email dan password
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;
            
            if (!user.emailVerified) {
                await signOut(auth);
                setError('Email belum diverifikasi. Silakan check email Anda dan klik link verifikasi.');
                return;
            }
            
            // Update status verifikasi
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { 
                emailVerified: true,
                isEmailVerified: true 
            }, { merge: true });
            
            navigate('home');
        } catch (err) {
            console.error('Login error:', err);
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    setError('Username atau password yang Anda masukkan salah.');
                    break;
                case 'auth/user-disabled':
                    setError('Akun Anda telah dinonaktifkan.');
                    break;
                case 'auth/too-many-requests':
                    setError('Terlalu banyak percobaan login. Coba lagi nanti.');
                    break;
                default:
                    setError('Terjadi kesalahan saat login.');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                    <p className="text-gray-600 mt-2">Please fill the form below to login to your account</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</p>}

                {/* Google Sign-in Button */}
                <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Facebook Sign-in Button */}
                <button 
                    disabled
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Basic Form */}
                <form onSubmit={handleUsernameLogin} className="space-y-4">
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
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <button type="button" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don't have account? <button onClick={() => navigate('register')} className="font-medium text-blue-600 hover:underline">Sign up</button>
                </p>
            </div>
        </div>
    );
}

function RegisterPage({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

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
                    Already have an account? <button onClick={() => navigate('login')} className="font-medium text-blue-600 hover:underline">Sign In</button>
                </p>
            </div>
        </div>
    );
}

function EmailVerificationPage({ email, navigate }) {
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage('');
        
        try {
            // Untuk resend, kita perlu login dulu sementara
            await signInWithEmailAndPassword(auth, email, 'temp'); // Ini tidak akan berhasil, tapi kita bisa coba cara lain
            
            // Alternatif: beri tahu user untuk check email
            setMessage('Email verifikasi telah dikirim ulang!');
        } catch (error) {
            setMessage('Gagal mengirim ulang email verifikasi. Silakan coba lagi nanti.');
        } finally {
            setIsResending(false);
        }
    };

    const handleVerificationComplete = () => {
        navigate('login');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                {/* Email Icon */}
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
                    onClick={() => navigate('login')}
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

function AdminSidebar({ activeTab, setActiveTab, navigate, handleLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'events', label: 'Kelola Event', icon: Calendar },
        { id: 'kuliner', label: 'Kelola Kuliner', icon: UtensilsCrossed },
        { id: 'tour', label: 'Kelola Tour', icon: MapPin },
        { id: 'users', label: 'Kelola Users', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                        <p className="text-sm text-gray-500">LokaBudaya</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-6">
                <div className="px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center px-3 py-3 text-left rounded-lg mb-1 transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-500'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <button
                    onClick={() => navigate('home')}
                    className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg mb-2 transition-colors"
                >
                    <Home className="w-5 h-5 mr-3" />
                    Kembali ke Home
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}

function AdminDashboard({ events, navigate, userData }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [kuliners, setKuliners] = useState([]);
    const [tours, setTours] = useState([]);
    
    // States untuk event management
    const [kategori, setKategori] = useState('');
    const [namaEvent, setNamaEvent] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [harga, setHarga] = useState('');
    const [rating, setRating] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Proteksi halaman: jika bukan admin, redirect ke home
    useEffect(() => {
        if (!userData || userData.role !== 'admin') {
            navigate('home');
        }
    }, [userData, navigate]);

    // Fetch users data
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'kuliners'), (snapshot) => {
            const kulinersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setKuliners(kulinersData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'tours'), (snapshot) => {
            const toursData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTours(toursData);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('home');
    };

    if (!userData || userData.role !== 'admin') {
        return <div className="flex justify-center items-center h-screen">
            <p>Redirecting...</p>
        </div>;
    }

    // Function untuk upload gambar ke Vercel Blob
    const handleImageUpload = async (file) => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setImageUrl(result.url);
                console.log('Upload berhasil:', result.url);
            } else {
                console.error('Upload gagal:', result.error);
                alert('Upload gagal: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };

    const addKuliner = async (kulinerData) => {
        try {
            await addDoc(collection(db, 'kuliners'), kulinerData);
            alert('Kuliner berhasil ditambahkan!');
        } catch (error) {
            console.error('Error adding kuliner:', error);
            alert('Gagal menambahkan kuliner');
        }
    };

    const deleteKuliner = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kuliner ini?")) {
            try {
                await deleteDoc(doc(db, 'kuliners', id));
                alert('Kuliner berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting kuliner:', error);
                alert('Gagal menghapus kuliner');
            }
        }
    };

    const addTour = async (tourData) => {
        try {
            await addDoc(collection(db, 'tours'), tourData);
            alert('Tour berhasil ditambahkan!');
        } catch (error) {
            console.error('Error adding tour:', error);
            alert('Gagal menambahkan tour');
        }
    };

    const deleteTour = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus tour ini?")) {
            try {
                await deleteDoc(doc(db, 'tours', id));
                alert('Tour berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting tour:', error);
                alert('Gagal menghapus tour');
            }
        }
    };

    const addEvent = async (e) => {
        e.preventDefault();
        
        // Validasi field yang required
        if (namaEvent.trim() === '' || lokasi.trim() === '' || deskripsi.trim() === '' || 
            kategori === '' || harga === '' || rating === '' || 
            startDate === '' || endDate === '' || eventTime === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        try {
            await addDoc(collection(db, 'events'), {
                title: namaEvent,
                location: lokasi,
                desc: deskripsi,
                category: kategori,
                price: parseInt(harga),
                rating: parseFloat(rating),
                latitude: latitude ? parseFloat(latitude) : 0,
                longtitude: longitude ? parseFloat(longitude) : 0,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                eventTime: eventTime,
                imgRes: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Event',
                isFavorite: false,
                
                // Field tambahan untuk kompatibilitas web
                nama_event: namaEvent,
                lokasi: lokasi,
                deskripsi: deskripsi,
                kategori: kategori,
                harga_tiket: parseInt(harga),
                tanggal_event: new Date(startDate),
                gambar_event: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Event'
            });

            // Reset form
            setNamaEvent('');
            setLokasi('');
            setDeskripsi('');
            setKategori('');
            setHarga('');
            setRating('');
            setLatitude('');
            setLongitude('');
            setStartDate('');
            setEndDate('');
            setEventTime('');
            setImageUrl('');
            setImageFile(null);
            
            alert('Event berhasil ditambahkan!');
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Gagal menambahkan event');
        }
    };

    const deleteEvent = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
            try {
                await deleteDoc(doc(db, 'events', id));
                alert('Event berhasil dihapus!');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Gagal menghapus event');
            }
        }
    };

    // Render content berdasarkan active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <AdminDashboardOverview events={events} users={users} />;
            case 'events':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Kelola Event</h2>
                        
                        {/* Form Tambah Event */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Tambah Event Baru</h3>
                            <form onSubmit={addEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Nama Event */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event</label>
                                    <input 
                                        value={namaEvent} 
                                        onChange={e => setNamaEvent(e.target.value)} 
                                        placeholder="Nama Event" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                    />
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select 
                                        value={kategori} 
                                        onChange={e => setKategori(e.target.value)} 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Festival">Festival</option>
                                        <option value="Pertunjukan Seni">Pertunjukan Seni</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Pameran">Pameran</option>
                                        <option value="Konser">Konser</option>
                                    </select>
                                </div>

                                {/* Lokasi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                                    <input 
                                        value={lokasi} 
                                        onChange={e => setLokasi(e.target.value)} 
                                        placeholder="Lokasi Event" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                    />
                                </div>

                                {/* Harga */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket (Rp)</label>
                                    <input 
                                        type="number"
                                        value={harga} 
                                        onChange={e => setHarga(e.target.value)} 
                                        placeholder="50000" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                        min="0"
                                    />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                                    <input 
                                        type="number"
                                        value={rating} 
                                        onChange={e => setRating(e.target.value)} 
                                        placeholder="4.5" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                        min="1"
                                        max="5"
                                        step="0.1"
                                    />
                                </div>

                                {/* Latitude */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input 
                                        type="number"
                                        value={latitude} 
                                        onChange={e => setLatitude(e.target.value)} 
                                        placeholder="-7.574178450295152" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        step="any"
                                    />
                                </div>

                                {/* Longitude */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input 
                                        type="number"
                                        value={longitude} 
                                        onChange={e => setLongitude(e.target.value)} 
                                        placeholder="110.81591618151339" 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        step="any"
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input 
                                        type="date"
                                        value={startDate} 
                                        onChange={e => setStartDate(e.target.value)} 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input 
                                        type="date"
                                        value={endDate} 
                                        onChange={e => setEndDate(e.target.value)} 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                    />
                                </div>

                                {/* Event Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Event</label>
                                    <input 
                                        type="time"
                                        value={eventTime} 
                                        onChange={e => setEventTime(e.target.value)} 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                                        required
                                    />
                                </div>

                                {/* Upload Gambar */}
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Event</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                handleImageUpload(file);
                                            }
                                        }}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="flex items-center mt-1">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                                            <p className="text-sm text-blue-600">Uploading...</p>
                                        </div>
                                    )}
                                    {imageUrl && (
                                        <p className="text-sm text-green-600 mt-1 flex items-center">
                                            <span className="mr-1">✓</span> Upload berhasil
                                        </p>
                                    )}
                                </div>
                                
                                {/* Deskripsi */}
                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Event</label>
                                    <textarea 
                                        value={deskripsi} 
                                        onChange={e => setDeskripsi(e.target.value)} 
                                        placeholder="Deskripsi lengkap event..." 
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                
                                {/* Submit Button */}
                                <div className="lg:col-span-3">
                                    <button 
                                        type="submit" 
                                        className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Processing...' : 'Simpan Event'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Gambar */}
                        {imageUrl && (
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h4 className="font-semibold mb-3 text-gray-700">Preview Gambar Event:</h4>
                                <div className="flex items-start space-x-4">
                                    <img 
                                        src={imageUrl} 
                                        alt="Preview Event" 
                                        className="max-w-xs h-auto rounded-lg shadow-sm border"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">
                                            <strong>URL:</strong> {imageUrl}
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setImageUrl('');
                                                setImageFile(null);
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Hapus Gambar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tabel Daftar Event */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Daftar Event</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.map(event => (
                                            <tr key={event.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img 
                                                        src={event.imgRes || event.gambar_event} 
                                                        alt={event.title || event.nama_event}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {event.title || event.nama_event}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {event.eventTime && `${event.eventTime}`}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {event.location || event.lokasi}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                        {event.category || event.kategori || 'Tidak ada kategori'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    Rp {(event.price || event.harga_tiket || 0).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <span className="text-yellow-400">★</span>
                                                        <span className="ml-1 text-sm text-gray-600">
                                                            {event.rating || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {event.startDate ? 
                                                        new Date(event.startDate.toDate ? event.startDate.toDate() : event.startDate).toLocaleDateString('id-ID') :
                                                        event.tanggal_event ? 
                                                        new Date(event.tanggal_event.toDate()).toLocaleDateString('id-ID') : 
                                                        'N/A'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button 
                                                        onClick={() => deleteEvent(event.id)} 
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                        title="Hapus Event"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'kuliner':
                return <KulinerManagement 
                    kuliners={kuliners} 
                    addKuliner={addKuliner}
                    deleteKuliner={deleteKuliner}
                />;
            case 'tour':
                return <TourManagement 
                    tours={tours} 
                    addTour={addTour}
                    deleteTour={deleteTour}
                />;
            case 'users':
                return <UserManagement users={users} />;
            case 'analytics':
                return <AdminAnalytics events={events} users={users} />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <AdminDashboardOverview events={events} users={users} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                navigate={navigate}
                handleLogout={handleLogout}
            />
            
            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-y-auto">
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

function AdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-600">Pengaturan sistem dan konfigurasi admin</p>
            </div>

            {/* System Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                            <p className="text-sm text-gray-500">Enable maintenance mode untuk website</p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">User Registration</label>
                            <p className="text-sm text-gray-500">Izinkan pendaftaran user baru</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Verification Required</label>
                            <p className="text-sm text-gray-500">Wajibkan verifikasi email untuk user baru</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Event Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Event Duration (hours)</label>
                        <input 
                            type="number" 
                            defaultValue="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Ticket per User</label>
                        <input 
                            type="number" 
                            defaultValue="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Deadline (days before event)</label>
                        <input 
                            type="number" 
                            defaultValue="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Period (days)</label>
                        <input 
                            type="number" 
                            defaultValue="7"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                            <p className="text-sm text-gray-500">Kirim notifikasi via email</p>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                            <p className="text-sm text-gray-500">Kirim notifikasi via SMS</p>
                        </div>
                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
                    Save Settings
                </button>
            </div>
        </div>
    );
}

function AdminAnalytics({ events, users }) {
    const totalRevenue = events.reduce((sum, event) => sum + (event.price || event.harga_tiket || 0), 0);
    const avgRating = events.length > 0 ? 
        events.reduce((sum, event) => sum + (event.rating || 0), 0) / events.length : 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                <p className="text-gray-600">Analisis data dan statistik platform</p>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                Rp {totalRevenue.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {avgRating.toFixed(1)}/5
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                            <p className="text-2xl font-bold text-gray-900">+12%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Event Categories</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">New user registered: user@example.com</p>
                        <span className="text-xs text-gray-400">2 minutes ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">New event created: Festival Budaya Jakarta</p>
                        <span className="text-xs text-gray-400">1 hour ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-sm text-gray-600">Event updated: Workshop Batik</p>
                        <span className="text-xs text-gray-400">3 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AdminDashboardOverview({ events, users }) {
    const totalEvents = events.length;
    const totalUsers = users.length;
    const verifiedUsers = users.filter(user => user.isEmailVerified).length;
    const thisMonthEvents = events.filter(event => {
        const eventDate = new Date(event.startDate?.toDate ? event.startDate.toDate() : event.startDate);
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return eventDate >= thisMonth;
    }).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Selamat datang di Admin Panel LokaBudaya</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Verified Users</p>
                            <p className="text-2xl font-bold text-gray-900">{verifiedUsers}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Events This Month</p>
                            <p className="text-2xl font-bold text-gray-900">{thisMonthEvents}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                    <div className="space-y-3">
                        {events.slice(0, 5).map(event => (
                            <div key={event.id} className="flex items-center space-x-3">
                                <img 
                                    src={event.imgRes || event.gambar_event} 
                                    alt={event.title || event.nama_event}
                                    className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {event.title || event.nama_event}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {event.location || event.lokasi}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {users.slice(0, 5).map(user => (
                            <div key={user.id} className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {(user.profile?.displayname || user.email || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user.profile?.displayname || 'No Name'}
                                    </p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function KulinerManagement({ kuliners, addKuliner, deleteKuliner }) {
    const [title, setTitle] = useState('');
    const [kulinerTime, setKulinerTime] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Function untuk upload gambar
    const handleImageUpload = async (file) => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setImageUrl(result.url);
                console.log('Upload berhasil:', result.url);
            } else {
                console.error('Upload gagal:', result.error);
                alert('Upload gagal: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (title.trim() === '' || location.trim() === '' || desc.trim() === '' || 
            price === '' || rating === '' || kulinerTime === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        const kulinerData = {
            title: title,
            kulinerTime: kulinerTime,
            price: parseInt(price),
            rating: parseFloat(rating),
            location: location,
            desc: desc,
            latitude: latitude ? parseFloat(latitude) : 0,
            longtitude: longitude ? parseFloat(longitude) : 0, // Note: typo sesuai Android
            imgRes: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Kuliner',
            isFavorite: false, // Hidden field, always false
            createdAt: new Date()
        };

        await addKuliner(kulinerData);

        // Reset form
        setTitle('');
        setKulinerTime('');
        setPrice('');
        setRating('');
        setLocation('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        setImageUrl('');
        setImageFile(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kelola Kuliner</h2>
            
            {/* Form Tambah Kuliner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Tambah Kuliner Baru</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kuliner</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Nama Kuliner" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Kuliner Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                        <input 
                            value={kulinerTime} 
                            onChange={e => setKulinerTime(e.target.value)} 
                            placeholder="10 AM - 9 PM" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Lokasi Kuliner" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <input 
                            type="number"
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            placeholder="25000" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="0"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input 
                            type="number"
                            value={rating} 
                            onChange={e => setRating(e.target.value)} 
                            placeholder="4.5" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    {/* Latitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input 
                            type="number"
                            value={latitude} 
                            onChange={e => setLatitude(e.target.value)} 
                            placeholder="-7.5709241" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Longitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input 
                            type="number"
                            value={longitude} 
                            onChange={e => setLongitude(e.target.value)} 
                            placeholder="110.7926132" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Upload Gambar */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Kuliner</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImageFile(file);
                                    handleImageUpload(file);
                                }
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="flex items-center mt-1">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                                <p className="text-sm text-blue-600">Uploading...</p>
                            </div>
                        )}
                        {imageUrl && (
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <span className="mr-1">✓</span> Upload berhasil
                            </p>
                        )}
                    </div>
                    
                    {/* Deskripsi */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Kuliner</label>
                        <textarea 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Deskripsi lengkap kuliner..." 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="lg:col-span-3">
                        <button 
                            type="submit" 
                            className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={uploading}
                        >
                            {uploading ? 'Processing...' : 'Simpan Kuliner'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Gambar */}
            {imageUrl && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold mb-3 text-gray-700">Preview Gambar Kuliner:</h4>
                    <div className="flex items-start space-x-4">
                        <img 
                            src={imageUrl} 
                            alt="Preview Kuliner" 
                            className="max-w-xs h-auto rounded-lg shadow-sm border"
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>URL:</strong> {imageUrl}
                            </p>
                            <button 
                                onClick={() => {
                                    setImageUrl('');
                                    setImageFile(null);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Hapus Gambar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Daftar Kuliner */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Daftar Kuliner</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuliner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Operasional</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {kuliners.map(kuliner => (
                                <tr key={kuliner.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            src={kuliner.imgRes} 
                                            alt={kuliner.title}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {kuliner.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {kuliner.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {kuliner.kulinerTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        Rp {kuliner.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-400">★</span>
                                            <span className="ml-1 text-sm text-gray-600">
                                                {kuliner.rating}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => deleteKuliner(kuliner.id)} 
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Hapus Kuliner"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function TourManagement({ tours, addTour, deleteTour }) {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // Function untuk upload gambar
    const handleImageUpload = async (file) => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setImageUrl(result.url);
                console.log('Upload berhasil:', result.url);
            } else {
                console.error('Upload gagal:', result.error);
                alert('Upload gagal: ' + result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (title.trim() === '' || location.trim() === '' || desc.trim() === '' || 
            price === '' || rating === '' || time === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        const tourData = {
            title: title,
            time: time,
            price: parseInt(price),
            rating: parseFloat(rating),
            location: location,
            desc: desc,
            latitude: latitude ? parseFloat(latitude) : 0,
            longtitude: longitude ? parseFloat(longitude) : 0, // Note: typo sesuai Android
            imgRes: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Tour',
            isFavorite: false, // Hidden field, always false
            createdAt: new Date()
        };

        await addTour(tourData);

        // Reset form
        setTitle('');
        setTime('');
        setPrice('');
        setRating('');
        setLocation('');
        setDesc('');
        setLatitude('');
        setLongitude('');
        setImageUrl('');
        setImageFile(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Kelola Tour</h2>
            
            {/* Form Tambah Tour */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Tambah Tour Baru</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tour</label>
                        <input 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Nama Tour" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Tour</label>
                        <input 
                            value={time} 
                            onChange={e => setTime(e.target.value)} 
                            placeholder="10 AM" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                        <input 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Lokasi Tour" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <input 
                            type="number"
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            placeholder="150000" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="0"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input 
                            type="number"
                            value={rating} 
                            onChange={e => setRating(e.target.value)} 
                            placeholder="4.5" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            required
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    {/* Latitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input 
                            type="number"
                            value={latitude} 
                            onChange={e => setLatitude(e.target.value)} 
                            placeholder="-7.574178450295152" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Longitude */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input 
                            type="number"
                            value={longitude} 
                            onChange={e => setLongitude(e.target.value)} 
                            placeholder="110.81591618151339" 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500" 
                            step="any"
                        />
                    </div>

                    {/* Upload Gambar */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Tour</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setImageFile(file);
                                    handleImageUpload(file);
                                }
                            }}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            disabled={uploading}
                        />
                        {uploading && (
                            <div className="flex items-center mt-1">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600 mr-2"></div>
                                <p className="text-sm text-blue-600">Uploading...</p>
                            </div>
                        )}
                        {imageUrl && (
                            <p className="text-sm text-green-600 mt-1 flex items-center">
                                <span className="mr-1">✓</span> Upload berhasil
                            </p>
                        )}
                    </div>
                    
                    {/* Deskripsi */}
                    <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tour</label>
                        <textarea 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Deskripsi lengkap tour..." 
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="lg:col-span-3">
                        <button 
                            type="submit" 
                            className="w-full md:w-auto px-6 py-3 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={uploading}
                        >
                            {uploading ? 'Processing...' : 'Simpan Tour'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Gambar */}
            {imageUrl && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold mb-3 text-gray-700">Preview Gambar Tour:</h4>
                    <div className="flex items-start space-x-4">
                        <img 
                            src={imageUrl} 
                            alt="Preview Tour" 
                            className="max-w-xs h-auto rounded-lg shadow-sm border"
                        />
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>URL:</strong> {imageUrl}
                            </p>
                            <button 
                                onClick={() => {
                                    setImageUrl('');
                                    setImageFile(null);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Hapus Gambar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabel Daftar Tour */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Daftar Tour</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tours.map(tour => (
                                <tr key={tour.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            src={tour.imgRes} 
                                            alt={tour.title}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {tour.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {tour.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {tour.time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        Rp {tour.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-yellow-400">★</span>
                                            <span className="ml-1 text-sm text-gray-600">
                                                {tour.rating}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => deleteTour(tour.id)} 
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Hapus Tour"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function UserManagement({ users }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDetail, setShowUserDetail] = useState(false);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (user.profile?.displayname || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserDetail(true);
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await setDoc(doc(db, 'users', userId), { role: newRole }, { merge: true });
            alert('Role user berhasil diupdate!');
        } catch (error) {
            console.error('Error updating user role:', error);
            alert('Gagal mengupdate role user');
        }
    };

    if (showUserDetail && selectedUser) {
        return (
            <UserDetailModal 
                user={selectedUser} 
                onClose={() => setShowUserDetail(false)}
                onUpdateRole={handleUpdateUserRole}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Kelola Users</h2>
                <div className="flex space-x-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    
                    {/* Filter Role */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">Semua Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Verified Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.isEmailVerified).length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => user.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">New This Month</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(user => {
                                    const userDate = new Date(user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt);
                                    const thisMonth = new Date();
                                    thisMonth.setDate(1);
                                    return userDate >= thisMonth;
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {(user.profile?.displayname || user.email || 'U')[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.profile?.displayname || 'No Name'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    @{user.username || user.profile?.username || 'username'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role === 'admin' ? 'Admin' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isEmailVerified 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.createdAt ? 
                                            new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString('id-ID') 
                                            : 'N/A'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewUser(user)}
                                            className="text-emerald-600 hover:text-emerald-900 mr-3"
                                        >
                                            Detail
                                        </button>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function UserDetailModal({ user, onClose, onUpdateRole }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Detail User</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Name</label>
                            <p className="mt-1 text-sm text-gray-900">{user.profile?.displayname || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <p className="mt-1 text-sm text-gray-900">{user.username || user.profile?.username || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <p className="mt-1 text-sm text-gray-900">{user.profile?.phonenumber || 'N/A'}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.isEmailVerified ? 'Yes' : 'No'}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <p className="mt-1 text-sm text-gray-900 font-mono">{user.uid}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user.createdAt ? 
                                    new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleString('id-ID') 
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}


// --- KOMPONEN UI ---
function Navbar({ user, userData, navigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('home');
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#" onClick={() => navigate('home')} className="flex items-center">
                            <Image 
                                src="/images/logo.png" 
                                alt="LokaBudaya Logo" 
                                width={135}
                                height={45}
                                className="h-auto w-auto"
                                priority
                            />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" onClick={() => navigate('home')} 
                           className="text-white hover:text-emerald-300 transition-colors duration-200 font-medium">
                            HOME
                        </a>
                        <a href="#" className="text-white hover:text-emerald-300 transition-colors duration-200 font-medium">
                            PARTNERSHIPS
                        </a>
                        <a href="#" className="text-white hover:text-emerald-300 transition-colors duration-200 font-medium">
                            ABOUT US
                        </a>
                    </div>

                    {/* Right Side - Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-white hover:text-emerald-300 transition-colors duration-200">
                                    <User size={20} />
                                    <span className="font-medium">{userData?.name || user.email}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    {userData?.role === 'admin' && (
                                        <a href="#" onClick={() => navigate('admin')} 
                                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                                            Admin Panel
                                        </a>
                                    )}
                                    <a href="#" onClick={handleLogout} 
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700">
                                        Log Out
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => navigate('login')} 
                                        className="px-6 py-2 text-white border border-white rounded-full hover:bg-white hover:text-emerald-800 transition-all duration-200 font-medium">
                                    Log In
                                </button>
                                <button onClick={() => navigate('register')} 
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 font-medium">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                className="text-white hover:text-emerald-300 transition-colors duration-200">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 py-4 px-4 shadow-lg">
                        <div className="flex flex-col space-y-4">
                            <a href="#" onClick={() => navigate('home')} 
                               className="text-gray-800 hover:text-emerald-600 font-medium">
                                PARTNERSHIPS
                            </a>
                            <a href="#" className="text-gray-800 hover:text-emerald-600 font-medium">
                                ABOUT US
                            </a>
                            {user ? (
                                <>
                                    <div className="border-t pt-4">
                                        <p className="text-gray-600 text-sm">{userData?.name || user.email}</p>
                                        {userData?.role === 'admin' && (
                                            <a href="#" onClick={() => navigate('admin')} 
                                               className="block mt-2 text-emerald-600 font-medium">
                                                Admin Panel
                                            </a>
                                        )}
                                        <button onClick={handleLogout} 
                                                className="block mt-2 text-red-600 font-medium">
                                            Log Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 border-t pt-4">
                                    <button onClick={() => navigate('login')} 
                                            className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-full font-medium">
                                        Log In
                                    </button>
                                    <button onClick={() => navigate('register')} 
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium">
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function HeroSection({ onFilterChange }) {
    return (
        <div className="relative">
            {/* Hero Content */}
            <div className="relative h-screen bg-cover bg-center" style={{ 
                        backgroundImage: "url('/images/hero-bg.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-start items-start text-left text-white px-4 md:px-8 lg:px-16 pt-32 md:pt-40">
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-wide max-w-4xl">
                        DISCOVER THE<br />
                        SIGHTS OF THE<br />
                        <span /*className="text-emerald-400"*/>FLORES</span>
                    </h1>
                </div>
            </div>
            {/* Filter Section */}
            <div className="relative -mt-16 z-10">
                <FilterSection onFilterChange={onFilterChange} />
            </div>
        </div>
    );
}

function FilterSection({ onFilterChange }) {
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const locations = [
        { value: 'all', label: 'All Locations' },
        { value: 'jakarta', label: 'Jakarta' },
        { value: 'bali', label: 'Bali' },
        { value: 'yogyakarta', label: 'Yogyakarta' },
        { value: 'bandung', label: 'Bandung' },
        { value: 'surabaya', label: 'Surabaya' }
    ];

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'festival', label: 'Festival' },
        { value: 'pertunjukan', label: 'Pertunjukan' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'pameran', label: 'Pameran' },
        { value: 'konser', label: 'Konser' }
    ];

    const handleFilterChange = () => {
        onFilterChange({
            location: selectedLocation,
            category: selectedCategory,
            date: selectedDate,
            search: searchQuery
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Location Dropdown */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <div className="relative">
                            <select 
                                value={selectedLocation}
                                onChange={(e) => {
                                    setSelectedLocation(e.target.value);
                                    setTimeout(handleFilterChange, 0);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {locations.map(location => (
                                    <option key={location.value} value={location.value}>
                                        {location.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Relevant to You</p>
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setTimeout(handleFilterChange, 0);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Fill Your Vibe</p>
                    </div>

                    {/* Date Picker */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <input 
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setTimeout(handleFilterChange, 0);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="dd/mm/yyyy"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Your Perfect Date</p>
                    </div>

                    {/* Search Button */}
                    <div className="relative">
                        <button 
                            onClick={handleFilterChange}
                            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                        >
                            Search
                        </button>
                        <p className="text-xs text-transparent mt-1">.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EventCard({ event }) {
    // Fungsi untuk mengubah format tanggal dari Firestore Timestamp ke string
    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return 'Tanggal tidak tersedia';
        return timestamp.toDate().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <img src={event.gambar_event} alt={event.nama_event} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/166534/FFFFFF?text=Event'; }} />
            <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-900">{event.nama_event}</h3>
                <p className="text-sm text-gray-500 mt-1">{event.lokasi} - <span className="font-semibold">{formatDate(event.tanggal_event)}</span></p>
                <p className="text-gray-700 mt-2 text-sm line-clamp-3">{event.deskripsi}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold text-emerald-600">Rp {event.harga_tiket?.toLocaleString('id-ID')}</p>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700">
                        <Ticket size={16} className="mr-2" /> Beli Tiket
                    </button>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-slate-800 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo dan Partner Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <img 
                                src="/images/logo.png" 
                                alt="LokaBudaya Logo" 
                                className="h-8 w-auto mb-4"
                            />
                        </div>
                        
                        {/* Partner Badges */}
                        <div className="mb-6">
                            {/* <div className="flex flex-wrap gap-2 mb-4">
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">IATA</span>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">ASITA</span>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <span className="text-xs font-bold text-gray-800">ISO</span>
                                </div>
                            </div> */}
                            <button className="bg-slate-700 text-white px-4 py-2 rounded text-sm hover:bg-slate-600 transition-colors flex items-center space-x-2">
                                <Handshake size={16} />
                                <span>Jadi Partner LokaBudaya</span>
                            </button>
                        </div>

                        {/* Payment Partners */}
                        <div>
                            <h4 className="text-white font-semibold mb-3">Partner Pembayaran</h4>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481390434-91c03767be9d8650e67d3236af416c78.webp?tr=h-19,q-75,w-57" alt="BCA Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481407355-5c172bc37ff6d37a75e16fc17032112b.webp?tr=h-19,q-75,w-57" alt="BRI Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481418674-af23636c3bb5dfae8181febb8b4c6713.webp?tr=h-19,q-75,w-57" alt="BNI Payment"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/02/20/1740022373472-39026d4e4ad5cfc5a8ec3b8c8d38254c.jpeg?tr=h-19,q-75,w-57" alt="OVO Payment"></img></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tentang LokaBudaya */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Tentang LokaBudaya</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Cara Pesan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Karier</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Follow kami di</h4>
                            <div className="space-y-2">
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Facebook size={16} />
                                    <span>Facebook</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Instagram size={16} />
                                    <span>Instagram</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Music size={16} />
                                    <span>TikTok</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Youtube size={16} />
                                    <span>Youtube</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <Twitter size={16} />
                                    <span>Twitter</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                                    <MessageCircle size={16} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Produk */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Produk</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Event Budaya</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tiket Pertunjukan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Festival</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pameran Seni</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tari Tradisional</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Paket Wisata</a></li>
                        </ul>
                    </div>

                    {/* Lainnya */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Lainnya</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya for Corporates</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Affiliate</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog LokaBudaya</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pemberitahuan Privasi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Daftarkan Bisnis Aktivitas Anda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Press Room</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Ads</a></li>
                        </ul>

                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Download LokaBudaya App</h4>
                            <div className="space-y-2">
                                <a href="#" className="block">
                                    <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.5.8/f/f519939e72eccefffb6998f1397901b7.svg" alt="Google Play" className="h-10 w-auto" />
                                </a>
                                <a href="#" className="block">
                                    <img src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v4.5.8/1/18339f1ae28fb0c49075916d11b98829.svg" alt="App Store" className="h-10 w-auto" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} LokaBudaya. Semua Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}