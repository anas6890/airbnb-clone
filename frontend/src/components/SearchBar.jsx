"use client";
import React from "react";
import { Search } from "lucide-react";
export default function SearchBar() {
    return (
        <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    N'importe où
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    Une semaine
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">Ajouter des voyageurs</div>
                    <div className="p-2 bg-brand rounded-full text-white">
                        <Search size={16} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}

