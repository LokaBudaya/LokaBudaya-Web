import { auth, db } from '@/lib/firebase';

"use client";

import { Ticket } from 'lucide-react';

export default function EventCard({ event }) {
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