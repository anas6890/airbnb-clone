"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ListingPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${apiUrl}/listings/${id}`)
            .then(res => res.json())
            .then(data => {
                setListing(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleBook = async () => {
        // Create booking. This is just for academic test so we make a dummy booking
        // The endpoint is POST /bookings
        // But bookings require authentication, so we might need a token if it's protected
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // Let's assume we create a payment directly if booking endpoint requires auth and we don't have login set up in frontend yet
        // Wait, the user said "ameliores le backend si c demande continue la logique avec stripe sache que c juste pour un projet academique dans juste striqeu pour le test"
        // Let's create a booking with random dates.
        try {
            // First we need a token to book since the backend is secured with JwtAuthGuard. 
            // Wait, does the frontend have auth implemented? Let's check.
            const token = localStorage.getItem("token") || ""; // We will mock or implement a simple login if needed
            
            const checkIn = new Date();
            const checkOut = new Date();
            checkOut.setDate(checkOut.getDate() + 2); // 2 nights

            const res = await fetch(`${apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    listingId: id,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                    guestsBreakdown: { adults: 1 }
                })
            });
            const data = await res.json();
            if (data._id) {
                router.push(`/checkout/${data._id}`);
            } else {
                alert("Failed to book (Please check authentication)");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-20 text-center">Chargement...</div>;
    if (!listing) return <div className="p-20 text-center">Logement introuvable</div>;

    const imageSrc = listing.images && listing.images.length > 0 && listing.images[0].includes("http")
        ? listing.images[0]
        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200";

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            <div className="flex justify-between items-center mb-6 text-gray-600">
                <span>{listing.location?.city}, {listing.location?.country}</span>
            </div>
            
            <div className="aspect-video w-full relative overflow-hidden rounded-xl mb-8">
                <img
                    alt={listing.title}
                    src={imageSrc}
                    className="object-cover h-full w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                    
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Équipements</h2>
                        <ul className="grid grid-cols-2 gap-4">
                            {listing.amenities?.map((amenity: string, i: number) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span>•</span> {amenity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-2xl font-bold">{listing.pricePerNight} € <span className="text-base font-normal text-gray-500">par nuit</span></div>
                        </div>
                        
                        <button 
                            onClick={handleBook}
                            className="w-full bg-[#ff385c] text-white py-3 rounded-lg font-semibold hover:bg-[#d90b63] transition"
                        >
                            Réserver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
