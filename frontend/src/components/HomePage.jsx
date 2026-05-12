"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Cards from "./Cards";
import Categories from "./Categories";

function ListingsContainer() {
    const searchParams = useSearchParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            
            // Build query string from searchParams
            const params = new URLSearchParams();
            if (searchParams.get("city")) params.set("city", searchParams.get("city"));
            if (searchParams.get("type")) params.set("type", searchParams.get("type"));

            try {
                const res = await fetch(`${apiUrl}/listings?${params.toString()}`);
                const data = await res.json();
                setListings(data || []);
            } catch (err) {
                console.error("Failed to fetch listings:", err);
                setListings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500">
                    <h3 className="text-2xl font-semibold mb-2">Aucun logement trouvé</h3>
                    <p className="font-light">Essayez de modifier vos critères de recherche.</p>
                </div>
            ) : (
                listings.map((listing) => (
                    <Cards key={listing._id} listing={listing} />
                ))
            )}
        </div>
    );
}

export default function HomePage() {
    return (
        <div>
            {/* CATEGORIES NAV */}
            <Suspense fallback={<div className="h-20 bg-gray-50 animate-pulse" />}>
                <Categories />
            </Suspense>
            
            {/* LISTINGS GRID */}
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-8 pb-20">
                <Suspense fallback={<div>Chargement...</div>}>
                    <ListingsContainer />
                </Suspense>
            </div>
        </div>
    );
}


