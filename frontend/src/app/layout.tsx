import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";

export const metadata: Metadata = {
    title: "Airbnb Clone",
    description: "Logements populaires à Marrakech",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
            <Header />
            {children}
        </body>
        </html>
    );
}