"use client";
import { useState } from "react";

function HeartIcon({ filled }) {
    return (
        <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
            {filled ? (
                <path
                    fill="#FF385C"
                    stroke="#FF385C"
                    strokeWidth="2"
                    d="M16 28s-14-9.5-14-18a8 8 0 0116 0 8 8 0 0116 0c0 8.5-14 18-14 18z"
                />
            ) : (
                <path
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    d="M16 28s-14-9.5-14-18a8 8 0 0116 0 8 8 0 0116 0c0 8.5-14 18-14 18z"
                />
            )}
        </svg>
    );
}

function StarIcon() {
    return (
        <svg viewBox="0 0 32 32" className="w-3 h-3 fill-current" aria-hidden="true">
            <path d="M16 1.9l4.1 8.3 9.2 1.3-6.7 6.5 1.6 9.2L16 22.7l-8.2 4.5 1.6-9.2L2.7 11.5l9.2-1.3z" />
        </svg>
    );
}

/* ─── LISTING CARD ─────────────────────────────────────────────────────────── */
export function ListingCard({ listing }) {
    const [favorite, setFavorite] = useState(listing.isFavorite);
    const [imgIndex, setImgIndex] = useState(0);

    const images = listing.images || [];
    const hasMultiple = images.length > 1;

    return (
        <article className="group cursor-pointer card-elevated bg-white rounded-2xl overflow-hidden">
            {/* Image Container - rectangular for a more mature look */}
            <div className="relative w-full h-56 md:h-64 lg:h-48 bg-gray-100 overflow-hidden">
                <img
                    src={images[imgIndex] || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                {/* Badge */}
                {listing.isNew && (
                    <div className="absolute top-3 left-3 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                        Nouveau
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setFavorite(!favorite);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <HeartIcon filled={favorite} />
                </button>

                {/* Image Dots (subtle) */}
                {hasMultiple && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImgIndex(i);
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-base leading-tight truncate">{listing.location}</p>
                        <p className="text-sm text-gray-500 mt-1 truncate">{listing.distance} • {listing.availableDates}</p>
                    </div>
                    {listing.rating && (
                        <div className="flex items-center gap-1 text-gray-900">
                            <StarIcon />
                            <span className="text-sm font-medium">{listing.rating}</span>
                        </div>
                    )}
                </div>

                <div className="mt-3 flex items-end justify-between">
                    <div>
                        <p className="text-gray-900 text-lg font-semibold">{listing.pricePerNight} MAD</p>
                        <p className="text-sm text-gray-500">par nuit</p>
                    </div>
                    <div className="text-sm text-gray-400">{listing.type || "Logement"}</div>
                </div>
            </div>
        </article>
    );
}

/* ─── EXPERIENCE CARD ───────────────────────────────────────────────────────── */
export function ExperienceCard({ experience }) {
    const [favorite, setFavorite] = useState(experience.isFavorite);

    return (
        <article className="group cursor-pointer card-elevated bg-white rounded-2xl overflow-hidden">
            <div className="relative w-full h-56 md:h-60 bg-gray-100 overflow-hidden">
                <img
                    src={experience.images?.[0] || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {experience.category}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setFavorite(!favorite);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <HeartIcon filled={favorite} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{experience.title}</p>
                    <p className="text-white/80 text-xs mt-1">{experience.duration}</p>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Avec <span className="font-medium text-gray-900">{experience.host}</span></p>
                    <div className="flex items-center gap-1 text-gray-900">
                        <StarIcon />
                        <span className="text-sm font-medium">{experience.rating}</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">{experience.pricePerPerson} MAD</p>
                    <p className="text-sm text-gray-400">/ personne</p>
                </div>
            </div>
        </article>
    );
}