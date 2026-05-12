"use client";
import React from "react";
import SearchBar from "./SearchBar";
import { Globe, Menu, UserCircle } from "lucide-react";
import Link from "next/link";
export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
                <div className="flex flex-row items-center justify-between gap-3 md:gap-0 py-4">
                    {/* Logo Section */}
                    <div className="hidden md:block cursor-pointer">
                        <Link href="/" className="flex items-center gap-2">
                           <span className="text-brand font-bold text-2xl tracking-tighter">alasBnb</span>
                        </Link>
                    </div>
                    {/* Search Bar Section */}
                    <SearchBar />
                    {/* User Menu Section */}
                    <div className="relative flex flex-row items-center gap-3">
                        <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                            Mettre mon logement sur alasBnb
                        </div>
                        <div className="hidden md:flex p-3 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                            <Globe size={18} />
                        </div>
                        <div className="p-4 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                            <Menu size={18} />
                            <div className="hidden md:block">
                                <UserCircle size={30} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

