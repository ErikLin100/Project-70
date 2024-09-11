module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
      fontWeight: {
        normal: 200,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        'slightly-relaxed': '1.3',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'main-start': '#8B5CF6',
        'main-end': '#6366F1',
      },
    },
  },
  plugins: [],
}