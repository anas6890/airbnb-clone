"use client";
import { useState } from "react";

const COLORS = [
    "#F4F4F5",
    "#FAFAFA",
    "#F0F0F0",
    "#FFFFFF",
    "#F8F9FA",
    "#E9ECEF",
];

let colorIndex = 0;

export default function Cards({ listing }) {
    const [liked, setLiked] = useState(false);
    const bg = COLORS[colorIndex++ % COLORS.length];

    return (
        <div className="listing-card">
            <div className="listing-img-wrap">
                {listing.image ? (
                    <img src={listing.image} alt={listing.name} className="listing-img" />
                ) : (
                    <div className="listing-img" style={{ background: bg }} />
                )}
                {listing.isFavorite && (
                    <div className="badge-coup">Coup de cœur</div>
                )}
                <button className={`heart-btn ${liked ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
                    {liked ? "♥" : "♡"}
                </button>
            </div>
            <div className="card-info">
                <div className="listing-name">{listing.name}</div>
                <div className="listing-dates">{listing.dates}</div>
                <div className="listing-price">
                    <strong className="price-tag">{listing.price} € au total</strong>
                    <span className="stars">★ {listing.rating}</span>
                </div>
            </div>
        </div>
    );
}