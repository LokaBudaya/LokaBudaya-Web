"use client";
import React from 'react';

export default function CategorySection({ events, tours, kuliners }) {
    // Ambil top 3 berdasarkan rating tertinggi
    const getTopRated = (items, count = 3) => {
        return items
            .filter(item => item.rating && item.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, count);
    };

    const topTours = getTopRated(tours);
    const topEvents = getTopRated(events);
    const topKuliners = getTopRated(kuliners);

    const CategoryCard = ({ item, type }) => {
        const formatDate = (date) => {
            if (!date) return '';
            const dateObj = date.toDate ? date.toDate() : new Date(date);
            return dateObj.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        };

        const getLocation = () => {
            return item.location || item.lokasi || 'Location not specified';
        };

        const getTitle = () => {
            return item.title || item.nama_event || 'Untitled';
        };

        const getDescription = () => {
            return item.desc || item.deskripsi || 'No description available';
        };

        const getImage = () => {
            return item.imgRes || item.gambar_event || 'https://placehold.co/400x300/166534/FFFFFF?text=' + type;
        };

        const getPrice = () => {
            return item.price || item.harga_tiket || 0;
        };

        const getAdditionalInfo = () => {
            if (type === 'Tour') {
                return item.time || '10 AM';
            } else if (type === 'Event') {
                return formatDate(item.startDate || item.tanggal_event);
            } else if (type === 'Kuliner') {
                return item.kulinerTime || '10 AM - 9 PM';
            }
            return '';
        };

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                    <img 
                        src={getImage()} 
                        alt={getTitle()}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                        <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                            {getAdditionalInfo()}
                        </span>
                    </div>
                    <div className="absolute top-3 right-3">
                        <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-700">
                            {getLocation()}
                        </span>
                    </div>
                </div>
                
                <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {getTitle()}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {getDescription()}
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-emerald-600 font-bold text-lg">
                                Rp {getPrice().toLocaleString('id-ID')}
                            </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                                <span className="text-sm">Details</span>
                            </button>
                            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                                <span className="text-sm">❤️</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center mt-2">
                        <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Tour Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Tours</h2>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        View All Tours →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topTours.length > 0 ? (
                        topTours.map(tour => (
                            <CategoryCard key={tour.id} item={tour} type="Tour" />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500">Belum ada data tour tersedia.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Event/Wisata Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        View All Events →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topEvents.length > 0 ? (
                        topEvents.map(event => (
                            <CategoryCard key={event.id} item={event} type="Event" />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500">Belum ada data event tersedia.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Kuliner Section */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Culinary</h2>
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        View All Culinary →
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topKuliners.length > 0 ? (
                        topKuliners.map(kuliner => (
                            <CategoryCard key={kuliner.id} item={kuliner} type="Kuliner" />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-gray-500">Belum ada data kuliner tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
