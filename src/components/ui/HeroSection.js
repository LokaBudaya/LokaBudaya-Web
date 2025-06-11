"use client";
import React from 'react';
import FilterSection from './FilterSection';

export default function HeroSection({ onFilterChange }) {
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