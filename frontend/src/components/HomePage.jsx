"use client";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Cards from "./Cards";

export default function HomePage() {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/listings")
            .then((res) => res.json())
            .then((data) => setListings(data))
            .catch(() => {
                // Données de secours si le backend n'est pas lancé
                setListings([
                    { _id: "1", name: "Appartement · Marrakech", dates: "15–17 mai", price: 238, rating: 5.0, isFavorite: false, image: "" },
                    { _id: "2", name: "Appartement · Marrakech", dates: "15–17 mai", price: 144, rating: 4.94, isFavorite: true, image: "" },
                    { _id: "3", name: "Appartement · Marrakech", dates: "8–10 mai",  price: 106, rating: 5.0, isFavorite: true, image: "" },
                    { _id: "4", name: "Appartement · Marrakech", dates: "22–24 mai", price: 131, rating: 4.98, isFavorite: true, image: "" },
                    { _id: "5", name: "Appartement · Marrakech", dates: "15–17 mai", price: 111, rating: 4.83, isFavorite: true, image: "" },
                    { _id: "6", name: "Appartement en résidence · Marrakech", dates: "15–17 mai", price: 138, rating: 5.0, isFavorite: false, image: "" },
                ]);
            });
    }, []);

    return (
        <div>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-top">
                    <a href="/" className="logo">✈ EMIbnb</a>
                    <div className="nav-tabs">
                        <a className="nav-tab active" href="#">🏠 Logements</a>
                        <a className="nav-tab" href="#" style={{position:"relative"}}>
                            <span className="badge">NOUVEAU</span>🎈 Expériences
                        </a>
                    </div>
                    <div className="nav-right">
                        <span className="become-host">Devenir hôte</span>
                        <div className="nav-icons">🌐 ☰ 👤</div>
                    </div>
                </div>
                <SearchBar />
            </nav>


            {/* LISTINGS */}
            <div className="listings-section">
                <div className="section-header">
                    <h2 className="section-title">Logements populaires · Marrakech →</h2>
                    <div className="nav-arrows">
                        <button className="arrow-btn">‹</button>
                        <button className="arrow-btn">›</button>
                    </div>
                </div>
                <div className="listings-grid">
                    {listings.map((listing) => (
                        <Cards key={listing._id} listing={listing} />
                    ))}
                </div>
            </div>
        </div>
    );
}