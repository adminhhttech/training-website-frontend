/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./index.html", // Ensure index.html is included for Vite projects
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
            },
            colors: {
                // Custom color palette: Charcoal and Orange
                primary: {
                    DEFAULT: "#1f2937", // Charcoal
                    light: "#374151",
                    dark: "#111827",
                },
                accent: {
                    DEFAULT: "#f97316", // Orange
                    light: "#fb923c",
                    dark: "#ea580c",
                },
                secondary: "#F5F7FA", // Kept from your original config
                // Shadcn/ui default colors (assuming these are defined via CSS variables in index.css)
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
