"use client";

"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterSection({ onFilterChange }) {
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