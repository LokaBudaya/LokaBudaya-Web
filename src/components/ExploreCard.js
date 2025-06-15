"use client";

import { Heart, Star, MapPin, Clock } from 'lucide-react';

export default function ExploreCard({ item }) {
  const getTitle = () => item.title || item.nama_event || 'Untitled';
  const getDescription = () => {
    const desc = item.desc || item.deskripsi || 'No description available';
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  };
  const getLocation = () => item.location || item.lokasi || 'Location not specified';
  const getPrice = () => item.price || item.harga_tiket || 0;
  const getImage = () => item.imgRes || item.gambar_event || 'https://placehold.co/400x300/166534/FFFFFF?text=' + item.type;
  const getRating = () => item.rating || 0;
  
  const getAdditionalInfo = () => {
    if (item.type === 'Tour') {
      return item.time || '10 AM';
    } else if (item.type === 'Event') {
      const date = item.startDate || item.tanggal_event;
      if (date) {
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short' 
        });
      }
      return 'TBA';
    } else if (item.type === 'Culinary') {
      return item.kulinerTime || '10 AM - 9 PM';
    }
    return '';
  };

  const getCategoryColor = () => {
    switch(item.type) {
      case 'Tour': return 'bg-blue-100 text-blue-800';
      case 'Culinary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img 
          src={getImage()} 
          alt={getTitle()}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor()}`}>
            {item.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart size={16} className="text-gray-600" />
          </button>
        </div>
        {getAdditionalInfo() && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 flex items-center">
              <Clock size={12} className="mr-1" />
              {getAdditionalInfo()}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {getTitle()}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {getDescription()}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{getLocation()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-600 font-bold text-lg">
              {getPrice() === 0 ? 'Free' : `Rp ${getPrice().toLocaleString('id-ID')}`}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-600">{getRating()}</span>
            </div>
            {/* <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Details
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}