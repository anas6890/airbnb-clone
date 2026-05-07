"use client";
import { useState } from "react";

const COLORS = [
    "linear-gradient(135deg,#c97c50,#a05c3a)",
    "linear-gradient(135deg,#3a3a4a,#2c2c3c)",
    "linear-gradient(135deg,#4a5a3a,#3a4a2c)",
    "linear-gradient(135deg,#d4c5a9,#b0a080)",
    "linear-gradient(135deg,#5a3a6a,#3a2050)",
    "linear-gradient(135deg,#e8d5c0,#c4a882)",
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
                    <div className="badge-coup">Coup de cœur<br />voyageurs</div>
                )}
                <button className="heart-btn" onClick={() => setLiked(!liked)}>
                    {liked ? "❤️" : "🤍"}
                </button>
            </div>
            <div>
                <div className="listing-name">{listing.name}</div>
                <div className="listing-dates">{listing.dates}</div>
                <div className="listing-price">
                    <strong>{listing.price} € au total</strong>
                    <span className="stars">★ {listing.rating}</span>
                </div>
            </div>
        </div>
    );
}