/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                jakarta: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
                sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
            },
            colors: {
                airbnb: {
                    red: "#FF385C",
                    pink: "#E31C5F",
                    dark: "#222222",
                },
            },
            boxShadow: {
                card: "0 6px 20px rgba(0,0,0,0.12)",
                "card-hover": "0 10px 40px rgba(0,0,0,0.18)",
            },
            borderRadius: {
                "2xl": "16px",
                "3xl": "24px",
            },
        },
    },
    plugins: [],
};
