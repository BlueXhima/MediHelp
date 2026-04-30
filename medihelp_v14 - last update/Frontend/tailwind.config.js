/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'pulse-grow': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
                    '50%': { transform: 'scale(1.8)', opacity: '1' },
                },
                waveform: {
                    '0%, 100%': { height: '20%' },
                    '50%': { height: '80%' },
                },
                // Marquee Keyframes para sa Testimonials
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
            },
            animation: {
                'pulse-grow': 'pulse-grow 1s infinite ease-in-out',
                'waveform': 'waveform 0.8s ease-in-out infinite',
                // Marquee Animations (40s para sa swabeng takbo)
                'marquee': 'marquee 40s linear infinite',
                'marquee2': 'marquee2 40s linear infinite',
            },
        },
    },
    // Inayos ang structure ng DaisyUI at Plugins
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#570df8", 
                    "secondary": "#f000b8",
                    "accent": "#37cdbe",
                    "neutral": "#3d4451",
                    "base-100": "#ffffff",
                },
            },
        ],
    },
    plugins: [
        require("daisyui"), // Siguraduhing naka-install ito via npm
    ],
}