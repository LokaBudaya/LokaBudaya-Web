"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ExploreCard from './ExploreCard';
import CategoryCard from './ui/CategoryCard';

export default function ExploreContent({ events, tours, kuliners }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Event', 'Tour', 'Culinary']);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Combine all data
  const allItems = useMemo(() => {
    const eventItems = events.map(item => ({ ...item, type: 'Event' }));
    const tourItems = tours.map(item => ({ ...item, type: 'Tour' }));
    const kulinerItems = kuliners.map(item => ({ ...item, type: 'Culinary' }));
    
    return [...eventItems, ...tourItems, ...kulinerItems];
  }, [events, tours, kuliners]);

  // Filter logic
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm || 
        (item.title || item.nama_event || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.desc || item.deskripsi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || item.lokasi || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.includes(item.type);

      // Price filter
      const itemPrice = item.price || item.harga_tiket || 0;
      const matchesPrice = selectedPriceRanges.length === 0 || selectedPriceRanges.some(range => {
        switch(range) {
          case 'free': return itemPrice === 0;
          case '10k-50k': return itemPrice >= 10000 && itemPrice <= 50000;
          case '50k-100k': return itemPrice >= 50000 && itemPrice <= 100000;
          case '100k-500k': return itemPrice >= 100000 && itemPrice <= 500000;
          case '500k+': return itemPrice > 500000;
          default: return true;
        }
      });

      // Rating filter
      const itemRating = item.rating || 0;
      const matchesRating = itemRating >= ratingRange[0] && itemRating <= ratingRange[1];

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [allItems, searchTerm, selectedCategories, selectedPriceRanges, ratingRange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (priceRange) => {
    setSelectedPriceRanges(prev => 
      prev.includes(priceRange) 
        ? prev.filter(p => p !== priceRange)
        : [...prev, priceRange]
    );
  };

  const FilterSidebar = ({ className = "" }) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border h-fit ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Keywords/Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Keywords</h4>
        <div className="space-y-2">
          {['Event', 'Tour', 'Culinary'].map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 accent-lookabudaya_dark_blue"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating
      <div className="mb-6">
        <h4 className="font-medium mb-3">Rating</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{ratingRange[0]}</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={ratingRange[0]}
            onChange={(e) => setRatingRange([parseFloat(e.target.value), ratingRange[1]])}
            className="flex-1"
          />
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={ratingRange[1]}
            onChange={(e) => setRatingRange([ratingRange[0], parseFloat(e.target.value)])}
            className="flex-1"
          />
          <span className="text-sm">{ratingRange[1]}</span>
        </div>
      </div> */}

      {/* Price */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price</h4>
        <div className="space-y-2">
          {[
            { label: 'Free - Rp 10,000', value: 'free' },
            { label: 'Rp 10,000 - 50,000', value: '10k-50k' },
            { label: 'Rp 50,000 - 100,000', value: '50k-100k' },
            { label: 'Rp 100,000 - 500,000', value: '100k-500k' },
            { label: '> Rp 500,000', value: '500k+' }
          ].map(price => (
            <label key={price.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(price.value)}
                onChange={() => handlePriceChange(price.value)}
                className="rounded border-gray-300 accent-lookabudaya_dark_blue"
              />
              <span className="text-sm">{price.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Events</h1>
          <p className="text-gray-600">Discover amazing events, tours, and culinary experiences</p>
        </div> */}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search events, tours, culinary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 py-2 border border-gray-300 rounded-full"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredItems.length} results found</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ExploreCard key={`${item.type}-${item.id}`} item={item} type={item.type}/>
                // <CategoryCard key={item.id} item={item} type={item.type}/>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results found</p>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed right-0 top-0 h-full w-80 bg-white overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}