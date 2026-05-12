"use client";
import { useEffect, useState } from "react";
import Cards from "./Cards";
import Categories from "./Categories";
export default function HomePage() {
    const [listings, setListings] = useState([]);
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${apiUrl}/listings`)
            .then((res) => res.json())
            .then((data) => {
                const mappedData = data.map(item => ({
                    _id: item._id,
                    name: item.title,
                    dates: "Disponible",
                    price: item.pricePerNight,
                    rating: item.avgRating || 0,
                    isFavorite: false,
                    image: item.images && item.images.length > 0 ? item.images[0] : "",
                }));
                // Duplicate elements if the database only returns a few so the grid looks full
                let result = [];
                if (mappedData.length > 0) {
                    for(let i=0; i<4; i++){
                        result = [...result, ...mappedData.map(md => ({...md, _id: md._id + "_" + i}))]
                    }
                }
                setListings(result.length ? result : fallbackData);
            })
            .catch(() => {
                setListings(fallbackData);
            });
    }, []);
    const fallbackData = [
        { _id: "1", name: "Riad Marrakech", dates: "15-17 mai", price: 238, rating: 5.0, isFavorite: false, image: "https://images.unsplash.com/photo-1539037116277-4db20d5bc8ea?auto=format&fit=crop&q=80&w=800" },
        { _id: "2", name: "Villa Palmeraie", dates: "15-17 mai", price: 144, rating: 4.94, isFavorite: true, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800" },
        { _id: "3", name: "Maison d'H�tes", dates: "8-10 mai",  price: 106, rating: 5.0, isFavorite: true, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800" },
        { _id: "4", name: "Appartement Gu�liz", dates: "22-24 mai", price: 131, rating: 4.98, isFavorite: true, image: "https://images.unsplash.com/photo-1582268611956-6211081014cc?auto=format&fit=crop&q=80&w=800" },
        { _id: "5", name: "Boutique Hotel", dates: "15-17 mai", price: 111, rating: 4.83, isFavorite: true, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
        { _id: "6", name: "Penthouse vue mer", dates: "15-17 mai", price: 138, rating: 5.0, isFavorite: false, image: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&q=80&w=800" },
        { _id: "7", name: "Riad Marrakech", dates: "15-17 mai", price: 238, rating: 5.0, isFavorite: false, image: "https://images.unsplash.com/photo-1539037116277-4db20d5bc8ea?auto=format&fit=crop&q=80&w=800" },
        { _id: "8", name: "Villa Palmeraie", dates: "15-17 mai", price: 144, rating: 4.94, isFavorite: true, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800" },
    ];
    return (
        <div>
            {/* CATEGORIES NAV */}
            <Categories />
            {/* LISTINGS GRID */}
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-8 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {listings.map((listing) => (
                        <Cards key={listing._id} listing={listing} />
                    ))}
                </div>
            </div>
        </div>
    );
}

