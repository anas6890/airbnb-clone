"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Cards({ listing }) {
    const [liked, setLiked] = useState(false);
    // Fallback if no images are provided
    const imageSrc =
        listing.images && listing.images.length > 0 && listing.images[0].includes("http")
            ? listing.images[0]
            : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800";
    return (
        <Link href={`/listing/${listing._id}`} className="col-span-1 cursor-pointer group block">
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <img
                        alt={listing.title || "Listing"}
                        src={imageSrc}
                        className="object-cover h-full w-full group-hover:scale-110 transition rounded-xl"
                    />
                    <div className="absolute top-3 right-3">
                        <Heart
                            size={28}
                            className={`transition ${liked ? "fill-brand text-brand" : "fill-neutral-500/50 text-white"}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setLiked(!liked);
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-start justify-between">
                     <div className="font-semibold text-lg line-clamp-1">{listing.location?.city}, {listing.location?.country}</div>
                     <div className="flex flex-row items-center gap-1 font-light">
                        <span className="text-sm">⭐</span> {listing.avgRating || "Nouveau"}
                     </div>
                </div>
                <div className="font-light text-neutral-500 line-clamp-1 -mt-1">
                    {listing.title}
                </div>
                <div className="font-light text-neutral-500 -mt-1">
                    Disponible
                </div>
                <div className="flex flex-row items-center gap-1 mt-1">
                    <div className="font-semibold">{listing.pricePerNight} €</div>
                    <div className="font-light">par nuit</div>
                </div>
            </div>
        </Link>
    );
}

