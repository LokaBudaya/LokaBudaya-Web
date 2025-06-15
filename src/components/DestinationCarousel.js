"use client";

import React, { useState, useRef } from 'react';
import text_carousel from "../../public/images/text_carousel.svg";
import bg_carousel from "../../public/images/bg-carousel.svg"
import Image from 'next/image';

import {
    ChevronLeft, ChevronRight
} from 'lucide-react';
import next from 'next';
import Link from 'next/link';

export default function DestinationCarousel() {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const destinations = [
        {
            id: 1,
            name: "Yogya",
            image: "/images/destinations/carousel-yogya.svg",
        },
        {
            id: 2,
            name: "Jakarta",
            image: "/images/destinations/carousel-jakarta.svg",
        },
        {
            id: 3,
            name: "Solo",
            image: "/images/destinations/carousel-solo.svg",
        },
        {
            id: 4,
            name: "Batam",
            image: "/images/destinations/carousel-batam.svg",
        },
        {
            id: 5,
            name: "Batam",
            image: "/images/destinations/carousel-batam.svg",
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
            <div className='hover:-translate-y-6 duration-300 transition-all'>
                <div className="group cursor-pointer overflow-hidden rounded-lg flex-shrink-0 w-72">
                    <div className="h-48 overflow-hidden">
                        <img 
                            src={destination.image} 
                            alt={destination.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='relative w-full h-full py-12'>
            <Image src={bg_carousel} className='absolute top-0 object-cover w-full' alt='bg carousel'></Image>
            <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <Image src={text_carousel} alt='Carousel text' className='mx-auto mb-4'></Image>
                    <p className="text-white font-extralight">
                        Take your journey and drawn yourself into the beauty of Indonesia the world never knew  
                    </p>
                </div>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button 
                        onClick={scrollLeft}
                        className="absolute border left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Right Arrow */}
                {showRightArrow && (
                    <button 
                        onClick={scrollRight}
                        className="absolute border right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Scrollable Container */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-8 py-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {destinations.map(destination => (
                        <DestinationCard key={destination.id} destination={destination} />
                    ))}
                </div>
            </div>
            <div className='relative flex items-center'>
                <Link href='/' className='m-auto cursor-pointer relative border-4 border-lokabudaya_gold_hover_dark text-xl font-medium py-1 px-4 text-white hover:bg-lokabudaya_gold_hover_dark transition-all duration-300'>
                        Explore Now →
                </Link>
            </div>
        </div>
    );
}
