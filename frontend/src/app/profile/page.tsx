"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Mail, User as UserIcon, LogOut, Heart, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            try {
                // Fetch profile
                const profileRes = await fetch(`${apiUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = await profileRes.json();
                setUser(profileData);

                // Fetch bookings
                const bookingsRes = await fetch(`${apiUrl}/bookings/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div></div>;

    if (!user) return <div className="p-20 text-center">Utilisateur introuvable.</div>;

    return (
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-10 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column: User Card */}
                <div className="col-span-1">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <img
                                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
                                    alt="Avatar"
                                    className="rounded-full w-full h-full object-cover shadow-md"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-center">
                                {user.firstname} {user.lastname}
                            </h1>
                            <p className="text-gray-500 font-light text-sm mb-6">Voyageur</p>
                            
                            <div className="w-full border-t border-neutral-100 pt-6 space-y-4">
                                <div className="flex items-center gap-3 text-neutral-600">
                                    <Mail size={18} />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                {user.birthdate && (
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <Calendar size={18} />
                                        <span className="text-sm">Né(e) le {format(new Date(user.birthdate), 'dd MMMM yyyy', { locale: fr })}</span>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="mt-8 w-full flex items-center justify-center gap-2 border border-neutral-300 py-3 rounded-lg hover:bg-neutral-50 transition font-semibold"
                            >
                                <LogOut size={18} />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Bookings and Info */}
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-3xl font-bold mb-8">Mes Réservations</h2>
                    
                    {bookings.length === 0 ? (
                        <div className="bg-neutral-50 rounded-2xl p-10 text-center border border-dashed border-neutral-300">
                            <p className="text-neutral-500 mb-4">Vous n'avez pas encore de réservations.</p>
                            <button 
                                onClick={() => router.push("/")}
                                className="bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand/90 transition"
                            >
                                Explorer les logements
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="flex flex-col sm:flex-row gap-6 border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white">
                                    <div className="w-full sm:w-48 h-48 relative">
                                        <img
                                            src={booking.listingId?.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400"}
                                            alt={booking.listingId?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-bold text-xl">{booking.listingId?.title}</h3>
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                                                    booking.status === 'captured' ? 'bg-green-100 text-green-700' : 
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {booking.status === 'captured' ? 'Confirmé' : booking.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                                                <MapPin size={14} />
                                                {booking.listingId?.location?.city}, {booking.listingId?.location?.country}
                                            </div>
                                            <p className="text-neutral-600 text-sm font-medium">
                                                Du {format(new Date(booking.startDate), 'dd MMM yyyy', { locale: fr })} au {format(new Date(booking.endDate), 'dd MMM yyyy', { locale: fr })}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-lg font-bold">{booking.totalPrice} € <span className="font-light text-sm text-neutral-500">total</span></p>
                                            <button 
                                                onClick={() => router.push(`/listing/${booking.listingId?._id}`)}
                                                className="text-brand font-semibold hover:underline"
                                            >
                                                Voir l'annonce
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
