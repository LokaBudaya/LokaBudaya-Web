"use client";

import React, { useState, useRef } from 'react';
import CategoryCard from "./CategoryCard";

import {
    ChevronLeft, ChevronRight
} from 'lucide-react';

export default function CategorySection({ items = [], type }) {
    // Ambil top 3 berdasarkan rating tertinggi
    const getTopRated = (items = [], count = 3) => {
        return items
            .filter(item => item.rating && item.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, count);
    };

    const topItems = getTopRated(items);

    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const itemCards = topItems.map(item => (
            <CategoryCard key={item.id} item={item} type={type} />
        ));

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

    return (
        <div className="max-w-full">
            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button 
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 border"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Right Arrow */}
                {showRightArrow && (
                    <button 
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 border"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {/* Scrollable Container */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-10 py-8 px-4 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {itemCards.map(itemCard => (
                        itemCard
                    ))}
                </div>
            </div>
        </div>
    )
}

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className='relative w-full bg-blue-500'>
//                 {/* Tour Section */}
//                 <Image src={img_wayang} alt='image wayang' className='bg-amber-400 absolute'></Image>
//                 <div className='bg-amber-200 flex flex-col items-end w-1/2'>
//                     <h2 className='bg-red-100 text-4xl font-semibold text-right'>See What Event Everyone’s Talking About</h2>
//                     <div className="relative w-full bg-red-500">
//                         <Swiper modules={[Navigation, Pagination]}
//                             spaceBetween={16}
//                             slidesPerView={2}
//                             navigation={{ 
//                                 nextEl:".custom-next",
//                                 prevEl: ".custom-prev"
//                              }}
//                             pagination={{ clickable: true }}
//                             breakpoints={{
//                             640: { slidesPerView: 2 },
//                             768: { slidesPerView: 3 },
//                             1024: { slidesPerView: 3 },
//                             }}
//                             className="flex justify-end w-full">
//                                 {topEvents.length > 0 ? (
//                                 topEvents.map(event => (
//                                     <SwiperSlide key={event.id}>
//                                         <CategoryCard key={event.id} item={event} type="Event" />
//                                     </SwiperSlide>
//                                 ))
//                             ) : (
//                                 <div className="col-span-3 text-center py-8">
//                                     <p className="text-gray-500">Belum ada data event tersedia.</p>
//                                 </div>
//                             )}
//                         </Swiper>
//                         {/* Custom navigation buttons */}
//                         <div className="custom-next cursor-pointer absolute top-1/2 right-0 z-10 -translate-y-1/2">
//                         <Image src={img_swipe_navigation} alt="Next" width={40} height={40} />
//                         </div>
//                         <div className="custom-prev cursor-pointer absolute top-1/2 left-0 z-10 -translate-y-1/2">
//                         <Image src={img_swipe_navigation} alt="Prev" width={40} height={40} className="rotate-180"/>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="mb-12">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900">Tours</h2>
//                     <button className="text-emerald-600 hover:text-emerald-700 font-medium">
//                         View All Tours →
//                     </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {topTours.length > 0 ? (
//                         topTours.map(tour => (
//                             <CategoryCard key={tour.id} item={tour} type="Tour" />
//                         ))
//                     ) : (
//                         <div className="col-span-3 text-center py-8">
//                             <p className="text-gray-500">Belum ada data tour tersedia.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Event/Wisata Section */}
//             <div className="mb-12">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900">Events</h2>
//                     <button className="text-emerald-600 hover:text-emerald-700 font-medium">
//                         View All Events →
//                     </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {topEvents.length > 0 ? (
//                         topEvents.map(event => (
//                             <CategoryCard key={event.id} item={event} type="Event" />
//                         ))
//                     ) : (
//                         <div className="col-span-3 text-center py-8">
//                             <p className="text-gray-500">Belum ada data event tersedia.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Kuliner Section */}
//             <div className="mb-12">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-900">Culinary</h2>
//                     <button className="text-emerald-600 hover:text-emerald-700 font-medium">
//                         View All Culinary →
//                     </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {topKuliners.length > 0 ? (
//                         topKuliners.map(kuliner => (
//                             <CategoryCard key={kuliner.id} item={kuliner} type="Kuliner" />
//                         ))
//                     ) : (
//                         <div className="col-span-3 text-center py-8">
//                             <p className="text-gray-500">Belum ada data kuliner tersedia.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
