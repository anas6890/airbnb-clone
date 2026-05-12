"use client";
import React, { Suspense, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Globe, Menu, UserCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setIsOpen(false);
        router.push("/");
    };

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
                    <Suspense fallback={<div className="w-full md:w-auto py-2 rounded-full border h-12 animate-pulse" />}>
                        <SearchBar />
                    </Suspense>
                    {/* User Menu Section */}
                    <div className="relative flex flex-row items-center gap-3">
                        <Link href="/host">
                            <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                                Mettre mon logement sur alasBnb
                            </div>
                        </Link>
                        <div className="hidden md:flex p-3 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                            <Globe size={18} />
                        </div>
                        
                        <div className="relative">
                            <div 
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-4 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                            >
                                <Menu size={18} />
                                <div className="hidden md:block">
                                    <UserCircle size={30} className="text-gray-500" />
                                </div>
                            </div>

                            {isOpen && (
                                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-full bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer border border-neutral-100">
                                    {isLoggedIn ? (
                                        <>
                                            <Link href="/profile" className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => setIsOpen(false)}>
                                                Mon Profil
                                            </Link>
                                            <div className="px-4 py-3 hover:bg-neutral-100 transition" onClick={() => setIsOpen(false)}>
                                                Mes Favoris
                                            </div>
                                            <hr />
                                            <div onClick={logout} className="px-4 py-3 hover:bg-neutral-100 transition text-red-500">
                                                Déconnexion
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="px-4 py-3 hover:bg-neutral-100 font-semibold transition" onClick={() => setIsOpen(false)}>
                                                Connexion / Inscription
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}



