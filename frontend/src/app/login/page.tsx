"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        try {
            let res;
            if (isRegister) {
                res = await fetch(`${apiUrl}/users/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, firstname, lastname, birthdate })
                });
            } else {
                res = await fetch(`${apiUrl}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
            }
            
            const data = await res.json();
            if (res.ok && data.access_token) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                router.push("/");
            } else {
                setError(data.message || "Erreur lors de l'opération");
            }
        } catch (err) {
            console.error(err);
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isRegister ? "Créer un compte" : "Bon retour parmi nous"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isRegister ? "Rejoignez la communauté alasBnb" : "Connectez-vous pour continuer"}
                    </p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isRegister && (
                            <>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                                        placeholder="Prénom"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                                        placeholder="Nom"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-xs text-gray-500 ml-1 mb-1">Date de naissance</label>
                                    <input
                                        type="date"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm rounded-md"
                                        value={birthdate}
                                        onChange={(e) => setBirthdate(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <input
                                type="email"
                                required
                                className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm ${!isRegister ? 'rounded-t-md' : 'rounded-md mb-2'}`}
                                placeholder="Adresse e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm ${!isRegister ? 'rounded-b-md' : 'rounded-md'}`}
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-[#ff385c] hover:bg-[#d90b63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition disabled:opacity-50"
                        >
                            {loading ? "Chargement..." : (isRegister ? "S'inscrire" : "Se connecter")}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="font-medium text-brand hover:text-brand-dark underline text-sm"
                    >
                        {isRegister ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? Inscrivez-vous"}
                    </button>
                </div>
            </div>
        </div>
    );
}

