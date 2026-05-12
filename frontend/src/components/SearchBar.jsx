"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [city, setCity] = useState(searchParams.get("city") || "");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (city) {
            params.set("city", city);
        } else {
            params.delete("city");
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer flex items-center">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="text-sm font-semibold px-6 border-r flex-1">
                    <input 
                        type="text" 
                        placeholder="N'importe où" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="outline-none bg-transparent w-full"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-r flex-1 text-center whitespace-nowrap text-gray-500">
                    Une semaine
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-400 flex flex-row items-center gap-3 flex-1 justify-end">
                    <div className="hidden sm:block whitespace-nowrap">Ajouter des voyageurs</div>
                    <div 
                        onClick={handleSearch}
                        className="p-2 bg-brand rounded-full text-white hover:bg-brand/90 transition"
                    >
                        <Search size={16} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}


