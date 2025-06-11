"use client";

import React, { useState, useRef } from 'react';

import {
    ChevronLeft, ChevronRight
} from 'lucide-react';

export default function DestinationCarousel() {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const destinations = [
        {
            id: 1,
            name: "Yogya",
            image: "/images/destinations/yogya.png",
        },
        {
            id: 2,
            name: "Jakarta",
            image: "/images/destinations/jakarta.png",
        },
        {
            id: 3,
            name: "Solo",
            image: "/images/destinations/solo.png",
        },
        {
            id: 4,
            name: "Batam",
            image: "/images/destinations/batam.png",
        },
        {
            id: 5,
            name: "Batam",
            image: "/images/destinations/batam.png",
        }
    ];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const DestinationCard = ({ destination }) => {
        return (
            <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 w-72">
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Explore Popular Destinations
                </h2>
                <p className="text-gray-600">
                    Temukan keindahan dan keunikan budaya di berbagai kota di Indonesia
                </p>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button 
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Right Arrow */}
                {showRightArrow && (
                    <button 
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Scrollable Container */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {destinations.map(destination => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </div>
            </div>
        </div>
    );
}
