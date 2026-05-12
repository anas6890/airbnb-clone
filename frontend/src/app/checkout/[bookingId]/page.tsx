"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Make sure to put a dummy or test publishable key here.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TWDEODDjepyMOQ4...");

function CheckoutForm({ clientSecret, bookingId, paymentId }: { clientSecret: string, bookingId: string, paymentId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success?bookingId=${bookingId}`,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "Erreur de paiement");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setMessage("Paiement réussi !");
            // Call backend to manually update status since it's an academic project and webhooks might not be set up
            if (paymentId) {
                const token = localStorage.getItem("token") || "";
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                await fetch(`${apiUrl}/payments/${paymentId}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: "captured" })
                }).catch(console.error);
            }
            router.push(`/success?bookingId=${bookingId}`);
        } else {
            setMessage("Paiement en attente ou erreur inattendue.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border">
            <PaymentElement />
            <button 
                disabled={isLoading || !stripe || !elements}
                className="mt-6 w-full bg-[#ff385c] text-white py-3 rounded-lg font-semibold hover:bg-[#d90b63] transition disabled:opacity-50"
            >
                {isLoading ? "Traitement..." : "Payer maintenant"}
            </button>
            {message && <div className="mt-4 text-red-500 text-center">{message}</div>}
        </form>
    );
}

export default function CheckoutPage() {
    const params = useParams();
    const bookingId = params?.bookingId as string;
    const [clientSecret, setClientSecret] = useState("");
    const [paymentId, setPaymentId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;
        
        // Mock the token, you should get it from Auth context
        const token = localStorage.getItem("token") || ""; 

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // In backend, payments.controller.ts has POST /payments which takes bookingId
        fetch(`${apiUrl}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ bookingId, currency: "eur" })
        })
        .then(res => res.json())
        .then(data => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                console.error("No client secret returned", data);
            }
            if (data.payment && data.payment._id) {
                setPaymentId(data.payment._id);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [bookingId]);

    if (loading) return <div className="p-20 text-center">Chargement du paiement...</div>;
    // Note: If no clientSecret, Elements will fail. We need to make sure backend returns it.

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-8">Finaliser la réservation</h1>
            {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} bookingId={bookingId} paymentId={paymentId} />
                </Elements>
            ) : (
                <div className="text-red-500">Erreur de création de paiement. Assurez-vous d'être connecté.</div>
            )}
        </div>
    );
}
