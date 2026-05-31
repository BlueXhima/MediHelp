// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'infinite-scroll': 'infinite-scroll 40s linear infinite',
            },
            keyframes: {
                'infinite-scroll': {
                from: { transform: 'translateX(0)' },
                to: { transform: 'translateX(calc(-50% - 12px))' },
                }
            }
        },
    },
    plugins: [],
}