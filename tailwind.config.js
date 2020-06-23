const customPlugins = require("./tailwind-custom-plugins")

module.exports = {
  corePlugins: {
    preflight: false,
    alignContent: false,
    alignItems: false,
    alignSelf: false,
    justifyContent: false
  },
  theme: {
    extend: {
      flex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5'
      },

      spacing: {
        "1px": "1px",
        "2px": "2px",
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      colors: {
        brown: {
          default: "hsl(41, 30%, 59%)",
          100: "hsl(41, 48%, 96%)",
          200: "hsl(41, 45%, 88%)",
          300: "hsl(41, 40%, 80%)",
          400: "hsl(41, 33%, 70%)",
          500: "hsl(41, 30%, 59%)",
          600: "hsl(41, 27%, 50%)",
          700: "hsl(41, 22%, 40%)",
          800: "hsl(41, 15%, 30%)",
          900: "hsl(41, 10%, 20%)",
          contrast: "#ffffff"
        },
        primary: {
          default: "var(--color-primary-500)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          contrast: "var(--color-primary-contrast)"
        },
        secondary: {
          default: "var(--color-secondary-500)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          contrast: "var(--color-secondary-contrast)"
        },

        // default entspricht immer den 500-er-wert
        "apoly-green": {
          default: "#45919B",
          100: "#ECF4F5",
          200: "#D1E4E6",
          300: "#B5D3D7",
          400: "#7DB2B9",
          500: "#45919B",
          600: "#3E838C",
          700: "#29575D",
          800: "#1F4146",
          900: "#152C2F",
          contrast: "#ffffff"
        },
        "apoly-pink": {
          default: "#DA127D",
          100: "#FBE7F2",
          200: "#F6C4DF",
          300: "#F0A0CB",
          400: "#E559A4",
          500: "#DA127D",
          600: "#C41071",
          700: "#830B4B",
          800: "#620838",
          900: "#410526",
          contrast: "#ffffff"
        }
      }
    }
  },
  plugins: [
    customPlugins.alignContent,
    customPlugins.alignItems,
    customPlugins.alignSelf,
    customPlugins.justifyContent,
    customPlugins.justifyItems,
    customPlugins.justifySelf,
    customPlugins.borderRadiusFromSpacing,
    customPlugins.positionsFromSpacing,
    customPlugins.minMaxWidthHeightFromSpacing,
    customPlugins.fontSizeFromSpacing,
    customPlugins.grid
  ]
};
