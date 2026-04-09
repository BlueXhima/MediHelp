// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            keyframes: {
                'pulse-grow': {
                '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
                '50%': { transform: 'scale(1.8)', opacity: '1' },
                },
            },
            animation: {
                'pulse-grow': 'pulse-grow 1s infinite ease-in-out',
            },
        },
    },
    plugins: [],
}