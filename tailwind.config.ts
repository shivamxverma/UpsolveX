/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-delay": "fadeIn 0.5s ease-out 0.3s forwards",
        "text-reveal": "textReveal 1s ease-out",
        "pulse-slow": "pulse 4s infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        textReveal: { "0%": { opacity: "0", letterSpacing: "-0.05em", filter: "blur(4px)" }, "100%": { opacity: "1", letterSpacing: "normal", filter: "blur(0)" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
      },
    },
  },
  plugins: [],
};