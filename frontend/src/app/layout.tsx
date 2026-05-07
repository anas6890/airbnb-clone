import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Airbnb — Logements et Expériences",
    description: "Trouvez des logements uniques et vivez des expériences inoubliables.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
        </head>
        <body className="font-jakarta">{children}</body>
        </html>
    );
}
