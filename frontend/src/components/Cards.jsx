"use client";
import React, { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
export default function Cards({ listing }) {
    const [liked, setLiked] = useState(listing.isFavorite || false);
    // Fallback if no images are provided
    const imageSrc =
        listing.image && listing.image.includes("http")
            ? listing.image
            : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800";
    return (
        <div className="col-span-1 cursor-pointer group">
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <img
                        fill="true"
                        alt="Listing"
                        src={imageSrc}
                        className="object-cover h-full w-full group-hover:scale-110 transition rounded-xl"
                    />
                    <div className="absolute top-3 right-3">
                        <Heart
                            size={28}
                            className={`transition ${liked ? "fill-brand text-brand" : "fill-neutral-500/50 text-white"}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setLiked(!liked);
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-start justify-between">
                     <div className="font-semibold text-lg line-clamp-1">{listing.name}</div>
                     <div className="flex flex-row items-center gap-1 font-light">
                        <span className="text-sm">⭐</span> {listing.rating || "Nouveau"}
                     </div>
                </div>
                <div className="font-light text-neutral-500 line-clamp-1 -mt-1">
                    À 10 km de là
                </div>
                <div className="font-light text-neutral-500 -mt-1">
                    {listing.dates || "Bientôt disponible"}
                </div>
                <div className="flex flex-row items-center gap-1 mt-1">
                    <div className="font-semibold">{listing.price} €</div>
                    <div className="font-light">par nuit</div>
                </div>
            </div>
        </div>
    );
}

