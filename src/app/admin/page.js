"use client";

import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import {  signOut, onAuthStateChanged } from 'firebase/auth';
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { Trash2, Edit } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminSettings from './AdminSettings';
import AdminAnalytics from './AdminAnalytics';
import KulinerManagement from './KulinerManagement';
import TourManagement from './TourManagement';
import UserManagement from './UserManagement';
export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [kuliners, setKuliners] = useState([]);
    const [tours, setTours] = useState([]);
    const [events, setEvents] = useState([]);

    const [user, setUser] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserData(userData);
                        
                        // Check apakah user adalah admin
                        if (userData.role !== 'admin') {
                            router.push('/'); // Redirect jika bukan admin
                        }
                    } else {
                        router.push('/'); // User data tidak ditemukan
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    router.push('/');
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

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
        const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsData);
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
        router.push('/');
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!userData || userData.role !== 'admin') {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Redirecting...</p>
            </div>
        );
    }

    const updateKuliner = async (id, kulinerData) => {
        try {
            const kulinerRef = doc(db, 'kuliners', id);
            await setDoc(kulinerRef, kulinerData, { merge: true });
        } catch (error) {
            console.error('Error updating kuliner:', error);
            throw error;
        }
    };

    const updateTour = async (id, tourData) => {
        try {
            const tourRef = doc(db, 'tours', id);
            await setDoc(tourRef, tourData, { merge: true });
        } catch (error) {
            console.error('Error updating tour:', error);
            throw error;
        }
    };

    const startEditEvent = (event) => {
        setEditingEvent(event);
        setIsEditing(true);
        
        setNamaEvent(event.title || event.nama_event || '');
        setLokasi(event.location || event.lokasi || '');
        setDeskripsi(event.desc || event.deskripsi || '');
        setKategori(event.category || event.kategori || '');
        setHarga(event.price || event.harga_tiket || '');
        setRating(event.rating || '');
        setLatitude(event.latitude || '');
        setLongitude(event.longtitude || '');
        setStartDate(event.startDate ? new Date(event.startDate.toDate ? event.startDate.toDate() : event.startDate).toISOString().split('T')[0] : '');
        setEndDate(event.endDate ? new Date(event.endDate.toDate ? event.endDate.toDate() : event.endDate).toISOString().split('T')[0] : '');
        setEventTime(event.eventTime || '');
        setImageUrl(event.imgRes || event.gambar_event || '');
    };

    const cancelEdit = () => {
        setEditingEvent(null);
        setIsEditing(false);
        
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
    };

    const updateEvent = async (e) => {
        e.preventDefault();
        
        if (!editingEvent) return;
        
        if (namaEvent.trim() === '' || lokasi.trim() === '' || deskripsi.trim() === '' || 
            kategori === '' || harga === '' || rating === '' || 
            startDate === '' || endDate === '' || eventTime === '') {
            alert('Mohon lengkapi semua field yang diperlukan');
            return;
        }
        
        try {
            const eventRef = doc(db, 'events', editingEvent.id);
            await setDoc(eventRef, {
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
                
                nama_event: namaEvent,
                lokasi: lokasi,
                deskripsi: deskripsi,
                kategori: kategori,
                harga_tiket: parseInt(harga),
                tanggal_event: new Date(startDate),
                gambar_event: imageUrl || 'https://placehold.co/600x400/166534/FFFFFF?text=Event'
            }, { merge: true });

            alert('Event berhasil diupdate!');
            cancelEdit();
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Gagal mengupdate event');
        }
    };

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
                            <h3 className="text-xl font-semibold mb-4">
                                {isEditing ? `Edit Event: ${editingEvent?.title || editingEvent?.nama_event}` : 'Tambah Event Baru'}
                            </h3>
                            {isEditing && (
                                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                                    <p className="text-sm">
                                        <strong>Mode Edit:</strong> Anda sedang mengedit event "{editingEvent?.title || editingEvent?.nama_event}"
                                    </p>
                                </div>
                            )}
                            <form onSubmit={isEditing ? updateEvent : addEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                    <div className="flex space-x-4">
                                        <button 
                                            type="submit" 
                                            className="px-6 py-3 font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            disabled={uploading}
                                        >
                                            {uploading ? 'Processing...' : isEditing ? 'Update Event' : 'Simpan Event'}
                                        </button>
                                        
                                        {isEditing && (
                                            <button 
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-6 py-3 font-semibold text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
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
                                                    <div className="flex justify-end space-x-2">
                                                        <button 
                                                            onClick={() => startEditEvent(event)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Edit Event"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteEvent(event.id)} 
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Hapus Event"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
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
                updateKuliner={updateKuliner}
                />;
            case 'tour':
                return <TourManagement 
                    tours={tours} 
                    addTour={addTour}
                    deleteTour={deleteTour}
                    updateTour={updateTour}
                />;
            case 'users':
                return <UserManagement users={users} />;
            case 'analytics':
                return <AdminAnalytics events={events} users={users} kuliners={kuliners} tours={tours} />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <AdminDashboardOverview events={events} users={users} kuliners={kuliners} tours={tours} />;
            }
        };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                router={router}
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