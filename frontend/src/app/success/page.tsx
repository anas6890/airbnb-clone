"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams?.get("bookingId");

    return (
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-4 text-green-600">Paiement réussi !</h1>
            <p className="text-xl text-gray-600 mb-8">
                Votre réservation (ID: {bookingId || 'Inconnu'}) a été confirmée avec succès.
            </p>
            <Link href="/" className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition">
                Retour à l'accueil
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Chargement...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
