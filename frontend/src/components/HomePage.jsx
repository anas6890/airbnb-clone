"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { ListingCard, ExperienceCard } from "./Cards";
import {
    listings,
    experiences,
    listingCategories,
    experienceCategories,
} from "../data/mockData";

/* ─── LOGO ─────────────────────────────────────────────────────────────────── */
function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 shrink-0">
            <svg viewBox="0 0 32 32" className="w-10 h-10 text-red-500" aria-label="EMIBNB" role="img">
                <path
                    fill="currentColor"
                    d="M29.4 23.6c-.3-1-1-2-2-3.1-.4-.5-.9-1-1.4-1.6l-.6-.7-.3-.3c-.1-.2-.3-.3-.4-.5l-.2-.2c-.5-.6-1-1.2-1.4-1.7-.3-.4-.5-.8-.6-1.1-.1-.4-.2-.7-.1-1.1.1-.4.3-.8.7-1.1.3-.3.7-.4 1.1-.5.3 0 .6 0 1 .2.3.1.5.3.7.5.2.2.4.5.5.8.1.3.2.7.2 1.1 0 .3 0 .5-.1.7 0 .2-.1.4-.2.5l-.3.5.7.4.3-.5c.1-.2.2-.4.3-.7.1-.3.1-.6.1-.9 0-.5-.1-1-.3-1.4-.2-.5-.5-.9-.8-1.2-.4-.4-.8-.6-1.3-.8-.5-.2-1-.2-1.5-.2-.7.1-1.3.4-1.8.8-.5.5-.8 1.1-.9 1.7-.1.6 0 1.2.2 1.8.2.5.5 1 .9 1.5.4.5.9 1.1 1.4 1.7l.2.2.3.3.6.7c.5.6 1 1.1 1.4 1.6 1 1 1.6 1.9 1.9 2.8.3.8.2 1.6-.2 2.3-.4.7-1 1.2-1.8 1.6-.8.3-1.7.4-2.6.2-.9-.2-1.7-.7-2.3-1.4l-.1-.1C20 27.3 19 26 18 24.7c-.6-.8-1.2-1.6-1.8-2.4-.5-.7-1-1.4-1.5-2.1l-.3-.4-.3.4c-.5.7-1 1.4-1.5 2.1-.6.8-1.2 1.6-1.8 2.4-1 1.3-2 2.6-3.1 3.5l-.1.1c-.6.7-1.4 1.2-2.3 1.4-.9.2-1.8.1-2.6-.2-.8-.4-1.4-.9-1.8-1.6-.4-.7-.5-1.5-.2-2.3.3-.9 1-1.8 1.9-2.8.4-.5.9-1 1.4-1.6l.6-.7.3-.3.2-.2c.5-.6 1-1.2 1.4-1.7.4-.5.7-1 .9-1.5.2-.6.3-1.2.2-1.8-.1-.6-.4-1.2-.9-1.7-.5-.4-1.1-.7-1.8-.8-.5-.1-1 0-1.5.2-.5.2-.9.4-1.3.8-.3.3-.6.7-.8 1.2-.2.4-.3.9-.3 1.4 0 .3 0 .6.1.9.1.3.2.5.3.7l.3.5.7-.4-.3-.5c-.1-.1-.2-.3-.2-.5-.1-.2-.1-.4-.1-.7 0-.4.1-.8.2-1.1.1-.3.3-.6.5-.8.2-.2.4-.4.7-.5.4-.2.7-.2 1-.2.4.1.8.2 1.1.5.4.3.6.7.7 1.1.1.4 0 .7-.1 1.1-.1.3-.3.7-.6 1.1-.4.5-.9 1.1-1.4 1.7l-.2.2-.4.5-.3.3-.6.7c-.5.6-1 1.1-1.4 1.6-1 1.1-1.7 2.1-2 3.1-.4 1.1-.3 2.2.3 3.2.5.9 1.4 1.6 2.4 2.1 1 .4 2.2.5 3.3.2 1.1-.3 2.1-.9 2.9-1.8l.1-.1c1.1-1 2.1-2.3 3.2-3.7.6-.8 1.2-1.6 1.8-2.4.5-.7.9-1.3 1.4-2 .5.7.9 1.3 1.4 2 .6.8 1.2 1.6 1.8 2.4 1 1.4 2.1 2.7 3.2 3.7l.1.1c.8.9 1.8 1.5 2.9 1.8 1.1.3 2.3.2 3.3-.2 1-.5 1.9-1.2 2.4-2.1.6-1 .7-2.1.3-3.2z"
                />
            </svg>
            <span className="text-gray-900 font-bold text-lg tracking-tight hidden sm:block">EMIBNB</span>
        </Link>
    );
}

/* ─── HORIZONTAL NAV ───────────────────────────────────────────────────────── */
const NAV_ITEMS = [
    { id: "logements", label: "Logements", icon: "🏠" },
    { id: "experiences", label: "Expériences", icon: "🎈" },
];

function HorizontalNav({ active, onChange }) {
    return (
        <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors pb-3 border-b-2 relative ${
                        active === item.id
                            ? "text-gray-900 border-b-gray-900"
                            : "text-gray-600 border-b-transparent hover:text-gray-900"
                    }`}
                >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                        <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

/* ─── CATEGORY FILTER ───────────────────────────────────────────────────────── */
function CategoryFilter({ categories, active, onChange }) {
    const gradient = "linear-gradient(90deg,#7C3AED,#06B6D4)";
    return (
        <div className="w-full overflow-x-auto scrollbar-hide py-3">
            <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-3">
                {categories.map((cat) => {
                    const isActive = active === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onChange(cat.id)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-full text-base font-medium transition-all duration-200 ${isActive ? 'text-white shadow-md' : 'bg-white/60 text-gray-700 hover:bg-surface'}`}
                            style={isActive ? { background: gradient } : undefined}
                        >
                            <span className={`text-xl ${isActive ? 'text-white' : 'text-gray-700'}`}>{cat.icon}</span>
                            <span className="leading-none">{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
     );
}

/* ─── MAIN PAGE ─────────────────────────────────────────────────────────────── */
export default function HomePage() {
    const [mode, setMode] = useState("logements");
    const [activeCategory, setActiveCategory] = useState("all");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setActiveCategory("all");
    };

    const categories = mode === "logements" ? listingCategories : experienceCategories;

    // build unique locations from data and pass to SearchBar for suggestions
    const uniqueLocations = Array.from(
        new Set(
            [...listings, ...experiences]
                .map((it) => it.location || it.city || it.place || it.title || "")
                .filter(Boolean)
        )
    );

    const filteredListings =
        activeCategory === "all"
            ? listings
            : listings.filter((l) => {
                const catLabel = listingCategories.find((c) => c.id === activeCategory)?.label;
                return l.category === catLabel;
            });

    const filteredExperiences =
        activeCategory === "all"
            ? experiences
            : experiences.filter((e) => {
                const catLabel = experienceCategories.find((c) => c.id === activeCategory)?.label;
                return e.category === catLabel;
            });

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
             {/* ─── HEADER ─────────────────────────────────────────────────────── */}
             <header
                 className={`
           sticky top-0 z-50 bg-white/70 backdrop-blur-sm transition-shadow duration-300 border-b
           ${scrolled ? "shadow-md border-gray-200" : "border-transparent"}
         `}
             >
                 <div className="max-w-[1760px] mx-auto px-6 sm:px-10">

                     {/* Top row: Logo | Mode Toggle (centered) | Actions */}
                     <div className="grid grid-cols-3 items-center h-32 gap-4">
                         {/* Left: Logo (pushed a bit to the right) */}
                         <div className="flex items-center pl-4 sm:pl-8">
                             <Logo />
                         </div>

                         {/* Center: Mode toggle — always centered */}
                         <div className="flex justify-center">
                             <HorizontalNav active={mode} onChange={handleModeChange} />
                         </div>

                         {/* Right: Actions */}
                         <div className="flex items-center justify-end gap-2">
                             <button className="hidden lg:block text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap">
                                Mettez votre logement sur EMIBNB
                            </button>
                            <button className="p-2.5 rounded-full border border-gray-200 text-gray-700 hover:shadow-md transition-shadow duration-200">
                                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
                                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.2 8.8h2.1c.1.9.3 1.7.6 2.5a6.7 6.7 0 01-2.7-2.5zm0-1.6a6.7 6.7 0 012.7-2.5c-.3.8-.5 1.6-.6 2.5H1.2zm5.2 6.5c-.6-.7-1-1.6-1.3-2.5h2.6v2.8c-.5 0-.9-.1-1.3-.3zm1.3-4.1H5.5c-.1-.7-.2-1.4-.2-2.1h2.4v2.1zm0-3.7H5.3c.3-.9.7-1.8 1.3-2.5.4-.2.8-.3 1.3-.3v2.8zM9.6 14c.5-.7 1-1.6 1.3-2.5H13a6.7 6.7 0 01-3.4 2.5zm1.7-4.1h-1.7V7.8H12c0 .7-.1 1.4-.2 2.1H9.6zm.4-3.7h-2V3.4c.5 0 .9.1 1.3.3.6.7 1 1.6 1.3 2.5H11zm2.1 1.6c-.1-.9-.3-1.7-.6-2.5a6.7 6.7 0 012.7 2.5h-2.1zm.1 1.6h-2.1c.1-.7.2-1.4.2-2.1h2.2c-.1.8-.2 1.5-.3 2.1zm-2.3 1.6h2.1a6.7 6.7 0 01-2.7 2.5c.3-.8.5-1.6.6-2.5z" />
                                </svg>
                            </button>
                            <button className="flex items-center gap-3 border border-gray-200 rounded-full pl-3 pr-3 py-2 hover:shadow-md transition-shadow duration-200">
                                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-gray-600">
                                    <path d="M3 10c0-.6.4-1 1-1h24c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1zm0 6c0-.6.4-1 1-1h24c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1zm0 6c0-.6.4-1 1-1h24c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1z" />
                                </svg>
                                <div className="bg-gray-500 rounded-full p-2">
                                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                                        <path d="M16 16c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm0 3c-4 0-12 2-12 6v3h24v-3c0-4-8-6-12-6z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Search bar — full width, centered */}
                    <div className="pb-10">
                        <div className="max-w-[1200px] mx-auto">
                            <div className="card-elevated p-4 rounded-3xl bg-white">
                                <SearchBar mode={mode} suggestions={uniqueLocations} />
                            </div>
                        </div>
                    </div>
                 </div>
             </header>

             {/* Category filter — OUTSIDE header so it doesn't stick */}
             <div className="w-full border-b bg-white">
                 <div className="max-w-[1760px] mx-auto px-6 sm:px-10 py-6">
                     <CategoryFilter
                         categories={categories}
                         active={activeCategory}
                         onChange={setActiveCategory}
                     />
                 </div>
             </div>

             {/* ─── MAIN CONTENT ────────────────────────────────────────────────── */}
            <main className="max-w-[1760px] mx-auto px-6 sm:px-10 pt-8 pb-12">
                {mode === "logements" ? (
                    filteredListings.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                            {filteredListings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )
                ) : (
                    filteredExperiences.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
                            {filteredExperiences.map((exp) => (
                                <ExperienceCard key={exp.id} experience={exp} />
                            ))}
                        </div>
                    )
                )}

                {/* Total price toggle */}
                <div className="flex justify-center mt-14 mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-10 h-6 bg-gray-200 peer-checked:bg-gray-900 rounded-full transition-colors duration-200" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
              Afficher le prix total
            </span>
                    </label>
                </div>
            </main>
        </div>
    );
}

/* ─── EMPTY STATE ─────────────────────────────────────────────────────────── */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-500 max-w-sm">
                Essayez de modifier vos filtres ou explorez d&apos;autres catégories.
            </p>
        </div>
    );
}