/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-secondary-fixed": "#131e17",
        "tertiary-fixed": "#acf4a4",
        "tertiary": "#1f6223",
        "on-error-container": "#93000a",
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed": "#002204",
        "on-error": "#ffffff",
        "surface-tint": "#1b6d24",
        "background": "#fcf9f8",
        "surface-dim": "#dcd9d9",
        "secondary-fixed-dim": "#bdcabe",
        "on-primary-fixed-variant": "#005312",
        "on-background": "#1c1b1b",
        "surface-container": "#f0eded",
        "surface-container-highest": "#e5e2e1",
        "inverse-surface": "#313030",
        "on-tertiary-fixed-variant": "#0c5216",
        "surface-container-low": "#f6f3f2",
        "secondary-fixed": "#d9e6da",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "surface-bright": "#fcf9f8",
        "on-tertiary-fixed": "#002203",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#f3f0ef",
        "secondary-container": "#d9e6da",
        "on-primary": "#ffffff",
        "primary-fixed-dim": "#88d982",
        "on-secondary-container": "#5b675e",
        "primary": "#0d631b",
        "on-secondary-fixed-variant": "#3e4a41",
        "primary-container": "#2e7d32",
        "tertiary-container": "#3a7b39",
        "primary-fixed": "#a3f69c",
        "on-primary-container": "#cbffc2",
        "on-surface": "#1c1b1b",
        "error": "#ba1a1a",
        "on-tertiary-container": "#c8ffbf",
        "outline-variant": "#bfcaba",
        "on-surface-variant": "#40493d",
        "surface-variant": "#e5e2e1",
        "inverse-primary": "#88d982",
        "surface": "#fcf9f8",
        "outline": "#707a6c"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        "container-max-width": "1200px",
        "gutter": "24px",
        "base": "8px"
      },
      "fontFamily": {
        "headline-md": ["Inter"],
        "body-sm": ["Inter"],
        "numeric-display": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"]
      },
      "fontSize": {
        "headline-md": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "numeric-display": ["24px", { "lineHeight": "32px", "fontWeight": "500" }],
        "label-md": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
      }
    },
  },
  plugins: [],
}
