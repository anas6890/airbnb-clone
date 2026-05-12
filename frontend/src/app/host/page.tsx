"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [photos, setPhotos] = useState<FileList | null>(null);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Veuillez vous connecter d'abord !");
            router.push("/login");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        try {
            // 1. Create Listing
            const res = await fetch(`${apiUrl}/listings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    type: "apartment",
                    pricePerNight: Number(price),
                    location: {
                        address: "Custom Address",
                        city,
                        country: "Maroc",
                        lat: 31.6295,
                        lng: -7.9811
                    },
                    images: [],
                    maxGuests: 4,
                    bedrooms: 1,
                    beds: 1,
                    bathrooms: 1
                })
            });

            const listing = await res.json();

            // 2. Upload Photos if any
            if (listing._id && photos && photos.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < photos.length; i++) {
                    formData.append("photos", photos[i]);
                }

                await fetch(`${apiUrl}/listings/${listing._id}/photos`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });
            }

            alert("Logement créé avec succès !");
            router.push("/");
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Ajouter un logement</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Titre</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full border p-3 rounded-lg" rows={4}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Prix par nuit (€)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Ville</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Photos (optionnel)</label>
                    <input type="file" multiple onChange={e => setPhotos(e.target.files)} accept="image/*" className="w-full border p-3 rounded-lg bg-white" />
                </div>
                <button type="submit" className="bg-[#ff385c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#d90b63] transition mt-4">
                    Publier le logement
                </button>
            </form>
        </div>
    );
}
