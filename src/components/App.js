"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
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
    getDoc
} from 'firebase/firestore';
import { Handshake, Ticket, LogIn, UserPlus, LogOut, PlusCircle, Trash2, Home, User, Settings, Facebook, Instagram, Youtube, Twitter, MessageCircle, Music } from 'lucide-react';

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
            case 'login':
                return <LoginPage navigate={navigate} />;
            case 'register':
                return <RegisterPage navigate={navigate} />;
            case 'admin':
                return <AdminDashboard events={events} navigate={navigate} userData={userData} />;
            case 'home':
            default:
                return <HomePage events={events} navigate={navigate} />;
        }
    };

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
    return (
        <div>
            <HeroSection />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-center text-emerald-900 mb-8">Event Budaya Mendatang</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length > 0 ? (
                        events.map(event => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">Belum ada event yang tersedia.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function LoginPage({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        console.log("Attempting login with email:", email);
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Login successful");
            navigate('home');
        } catch (err) {
            console.error("Login error details:", err);
            console.error("Error code:", err.code);
            
            switch (err.code) {
                case 'auth/invalid-credential':
                    setError('Email atau password yang Anda masukkan salah. Silakan coba lagi.');
                    break;
                case 'auth/user-disabled':
                    setError('Akun Anda telah dinonaktifkan. Hubungi administrator.');
                    break;
                case 'auth/too-many-requests':
                    setError('Terlalu banyak percobaan login. Coba lagi nanti.');
                    break;
                case 'auth/network-request-failed':
                    setError('Masalah koneksi internet. Periksa koneksi Anda.');
                    break;
                default:
                    setError(`Terjadi kesalahan: ${err.message}`);
            }
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-emerald-900">Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        Masuk
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Belum punya akun? <button onClick={() => navigate('register')} className="font-medium text-emerald-600 hover:underline">Daftar di sini</button>
                </p>
            </div>
        </div>
    );
}

function RegisterPage({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Simpan data tambahan user (nama, role) ke Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: 'user' // Default role
            });

            navigate('home');
        } catch (err) {
            setError('Gagal mendaftar. Mungkin email sudah digunakan.');
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-emerald-900">Daftar Akun Baru</h2>
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        Daftar
                    </button>
                </form>
                 <p className="text-sm text-center text-gray-600">
                    Sudah punya akun? <button onClick={() => navigate('login')} className="font-medium text-emerald-600 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
}

function AdminDashboard({ events, navigate, userData }) {
     // Proteksi halaman: jika bukan admin, redirect ke home
    if (!userData || userData.role !== 'admin') {
        useEffect(() => {
           navigate('home');
        }, [navigate]);
        return null;
    }

    const [namaEvent, setNamaEvent] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [deskripsi, setDeskripsi] = useState('');

    const addEvent = async (e) => {
        e.preventDefault();
        if (namaEvent.trim() === '' || lokasi.trim() === '' || deskripsi.trim() === '') return;
        
        await addDoc(collection(db, 'events'), {
            nama_event: namaEvent,
            lokasi: lokasi,
            deskripsi: deskripsi,
            // Tambahkan field lain sesuai kebutuhan
            harga_tiket: 50000,
            kuota: 100,
            tanggal_event: new Date(),
            gambar_event: 'https://placehold.co/600x400/166534/FFFFFF?text=Event'
        });

        setNamaEvent('');
        setLokasi('');
        setDeskripsi('');
    };

    const deleteEvent = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
            await deleteDoc(doc(db, 'events', id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">Admin Dashboard</h2>
            
            {/* Form Tambah Event */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Tambah Event Baru</h3>
                <form onSubmit={addEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={namaEvent} onChange={e => setNamaEvent(e.target.value)} placeholder="Nama Event" className="w-full px-3 py-2 border rounded-md" />
                    <input value={lokasi} onChange={e => setLokasi(e.target.value)} placeholder="Lokasi" className="w-full px-3 py-2 border rounded-md" />
                    <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} placeholder="Deskripsi" className="w-full px-3 py-2 border rounded-md md:col-span-2"></textarea>
                    <button type="submit" className="w-full md:w-auto px-4 py-2 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center">
                        <PlusCircle className="mr-2 h-5 w-5" /> Simpan Event
                    </button>
                </form>
            </div>

            {/* Tabel Daftar Event */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Daftar Event</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.nama_event}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.lokasi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-800">
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
                                width={120}
                                height={40}
                                className="h-auto w-auto"
                                priority
                            />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" onClick={() => navigate('home')} 
                           className="text-white hover:text-emerald-300 transition-colors duration-200 font-medium">
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
                                    Sign In
                                </button>
                                <button onClick={() => navigate('register')} 
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 font-medium">
                                    Log In
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
                                        Sign In
                                    </button>
                                    <button onClick={() => navigate('register')} 
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium">
                                        Log In
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

function HeroSection() {
    return (
        <div className="relative h-screen bg-cover bg-center" style={{ 
                    backgroundImage: "url('/images/hero-bg.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4">
                <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-wide">
                    DISCOVER THE<br />
                    SIGHTS OF THE<br />
                    <span className="text-emerald-400">FLORES</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mb-8 font-light">
                    Beli tiket untuk festival, pertunjukan, dan pameran budaya paling otentik di seluruh nusantara.
                </p>
                <button className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105">
                    Explore your destinations
                </button>
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
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481390434-91c03767be9d8650e67d3236af416c78.webp?tr=h-19,q-75,w-57"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481407355-5c172bc37ff6d37a75e16fc17032112b.webp?tr=h-19,q-75,w-57"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/01/10/1736481418674-af23636c3bb5dfae8181febb8b4c6713.webp?tr=h-19,q-75,w-57"></img></span>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                    <span className="text-xs text-gray-800"><img src="https://ik.imagekit.io/tvlk/image/imageResource/2025/02/20/1740022373472-39026d4e4ad5cfc5a8ec3b8c8d38254c.jpeg?tr=h-19,q-75,w-57"></img></span>
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
                            <li><a href="#" className="hover:text-white transition-colors">Cicilan</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Rilisan Fitur Terbaru</a></li>
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
                            <li><a href="#" className="hover:text-white transition-colors">Workshop</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pameran Seni</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Konser Musik</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Teater</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tari Tradisional</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Xperience</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Paket Wisata</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Gift Voucher</a></li>
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
                            <li><a href="#" className="hover:text-white transition-colors">Daftarkan Akomodasi Anda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Daftarkan Bisnis Aktivitas Anda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Press Room</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LokaBudaya Ads</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Vulnerability Disclosure Program</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">APAC Travel Insights</a></li>
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