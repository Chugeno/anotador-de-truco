/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#f4f1ea',
                ink: '#1a1a1a',
                accent: '#e63946',
            },
            fontFamily: {
                sans: ['"Arial Black"', 'Helvetica', 'sans-serif'],
            },
            borderWidth: {
                '3': '3px',
            }
        },
    },
    plugins: [],
}
