"use client"

import { Heart, Share2 } from "lucide-react";
import { useState } from 'react';

export default function CategoryCard ({ item, type }) {
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

        const getCategory = () => {
            return type
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

        const getBadgeColor = () => {
            if (type === 'Tour') return 'bg-lokabudaya_tour text-white';
            if (type === 'Event') return 'bg-lokabudaya_event text-white';
            if (type === 'Kuliner' || type === 'Culinary') return 'bg-lokabudaya_kuliner text-white';
            return 'bg-gray-200 text-gray-700';
        };

        const getFontColor = () => {
            if (type === 'Tour') return 'text-lokabudaya_tour';
            if (type === 'Event') return 'text-lokabudaya_event';
            if (type === 'Kuliner' || type === 'Culinary') return 'text-lokabudaya_kuliner';
            return 'bg-gray-200 text-gray-700';
        };

        const formatHarga = (harga) => {
            if (harga >= 1_000_000) {
                const juta = harga / 1_000_000;
                return `${juta.toFixed(juta % 1 === 0 ? 0 : 1)} juta`;
            } else if (harga >= 1_000) {
                return harga.toLocaleString('id-ID'); // Tetap pakai format ribuan biasa
            } else {
                return harga.toString(); // untuk angka kecil
            }
        };

        const [wishlist, setWishlist] = useState(false);

        return (
            <div className="bg-white w-64 rounded-2xl border border-gray-300 overflow-hidden cursor-pointer transition-all flex-shrink-0 hover:-rotate-6 hover:shadow-lg duration-300">
                <div className="relative">
                    <img 
                        src={getImage()} 
                        alt={getTitle()}
                        className="w-full h-48 object-cover hover:h-44 transition-all"
                    />
                    <div className="absolute top-4 left-0">
                        <span className={`bg-lokabudaya_gold_hover_dark text-white pr-4 pl-3 py-1 rounded-br-full rounded-tr-full border border-white text-xs font-medium`}>
                            {getLocation()}
                        </span>
                    </div>
                    <div className="absolute top-4 right-0">
                        <span className={`${getBadgeColor()} pr-3 pl-4 py-1 rounded-bl-full rounded-tl-full border border-white text-xs font-medium`}>
                            {getCategory()}
                        </span>
                    </div>
                </div>
                
                <div className="p-4 ">
                    <h3 className="font-semibold text-lg w-full text-gray-900 truncate">
                        {getTitle()}
                    </h3>

                    <div className="flex items-center">
                        <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium text-xs ml-1">{item.rating}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <p className={`${getFontColor()} font-medium text-2xl`}>
                                <span className="text-lg font-light">Rp</span> {formatHarga(getPrice())}
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="p-1 rounded-full hover:bg-gray-50">
                                <span className="text-sm"><Share2 className="text-gray-400 w-5"></Share2></span>
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-50 text-sm" onClick={ () =>
                                setWishlist(!wishlist)
                            }>
                                {wishlist ? (
                                        <Heart strokeWidth={0} fill="Red"></Heart>
                                    ) : (
                                        <Heart className="text-gray-400"></Heart>
                                    )  
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };