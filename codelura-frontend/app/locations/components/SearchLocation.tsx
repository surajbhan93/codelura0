'use client';

import { useState } from 'react';
import { CITIES_LIST, CityLocation } from '../constants';
import CityCard from './CityCard';
import { Search, MapPin } from 'lucide-react';

export default function SearchLocation() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = CITIES_LIST.filter((city) => {
    const term = searchTerm.toLowerCase();
    return (
      city.name.toLowerCase().includes(term) ||
      city.state.toLowerCase().includes(term) ||
      city.shortDesc.toLowerCase().includes(term) ||
      city.popularServices.some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <section id="cities" className="py-16 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Search Bar Input Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Live City Finder</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Find Codelura Services in Your City
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Type your city or state name below to instantly view localized software development, SEO, and web engineering hub pages.
          </p>

          <div className="relative mt-4">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city name (e.g. Prayagraj, Noida, Lucknow, Gurugram)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-xl text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Result Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-900 pb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Showing <strong className="text-white">{filteredCities.length}</strong> location hubs across India</span>
          </div>
          {searchTerm && (
            <span>Filter query: "<strong className="text-cyan-400">{searchTerm}</strong>"</span>
          )}
        </div>

        {/* City Cards Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <div className="text-slate-400 text-lg font-bold">No location hub found matching "{searchTerm}"</div>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We are rapidly expanding across India. Even if your city isn't listed above, our remote engineering team serves clients nationwide!
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
