const customPlugins = require("./tailwind-custom-plugins")

///
// UTILS
///

function toColorFromVariable(rgbValuesVariableName) {
  return ({ opacityVariable }) => `rgba(var(${rgbValuesVariableName}), var(${opacityVariable}))`;
}

///
// CONFIG
///
module.exports = {
  purge: [],
  darkMode: false,
  corePlugins: {
    // we use custom variants for justify / align with the correct and explicite naming
    alignContent: false,
    alignItems: false,
    alignSelf: false,
    justifyContent: false,
    // we use line-height-* and letter-spacing-* and not the leading / tracking-utilities
    lineHeight: false,
    letterSpacing: false,
    // we do not use the grid-stuff atm
    gridAutoColumns: false,
    gridAutoFlow: false,
    gridAutoRows: false,
    gridColumn: false,
    gridColumnEnd: false,
    gridColumnStart: false,
    gridRow: false,
    gridRowEnd: false,
    gridRowStart: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
  },
  theme: {
    colors: require("tailwindcss/colors"),
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      flex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      spacing: {
        "2px": "2px",
        84: "21rem",
        128: "32rem",
      },
      colors: {
        primary: {
          DEFAULT: toColorFromVariable("--color-rgb-primary-500"),
          100: toColorFromVariable("--color-rgb-primary-100"),
          200: toColorFromVariable("--color-rgb-primary-200"),
          300: toColorFromVariable("--color-rgb-primary-300"),
          400: toColorFromVariable("--color-rgb-primary-400"),
          500: toColorFromVariable("--color-rgb-primary-500"),
          600: toColorFromVariable("--color-rgb-primary-600"),
          700: toColorFromVariable("--color-rgb-primary-700"),
          800: toColorFromVariable("--color-rgb-primary-800"),
          900: toColorFromVariable("--color-rgb-primary-900"),
          contrast: toColorFromVariable("--color-rgb-primary-contrast"),
        },
        secondary: {
          DEFAULT: toColorFromVariable("--color-rgb-secondary-500"),
          100: toColorFromVariable("--color-rgb-secondary-100"),
          200: toColorFromVariable("--color-rgb-secondary-200"),
          300: toColorFromVariable("--color-rgb-secondary-300"),
          400: toColorFromVariable("--color-rgb-secondary-400"),
          500: toColorFromVariable("--color-rgb-secondary-500"),
          600: toColorFromVariable("--color-rgb-secondary-600"),
          700: toColorFromVariable("--color-rgb-secondary-700"),
          800: toColorFromVariable("--color-rgb-secondary-800"),
          900: toColorFromVariable("--color-rgb-secondary-900"),
          contrast: toColorFromVariable("--color-rgb-secondary-contrast"),
        },
        // DEFAULT entspricht immer den 500-er-wert
        "apoly-green": {
          DEFAULT: "#45919B",
          100: "#ECF4F5",
          200: "#D1E4E6",
          300: "#B5D3D7",
          400: "#7DB2B9",
          500: "#45919B",
          600: "#3E838C",
          700: "#29575D",
          800: "#1F4146",
          900: "#152C2F",
          contrast: "#ffffff",
        },
        "apoly-pink": {
          DEFAULT: "#DA127D",
          100: "#FBE7F2",
          200: "#F6C4DF",
          300: "#F0A0CB",
          400: "#E559A4",
          500: "#DA127D",
          600: "#C41071",
          700: "#830B4B",
          800: "#620838",
          900: "#410526",
          contrast: "#ffffff",
        },
      },
    },
  },
  plugins: [
    customPlugins.alignContent,
    customPlugins.alignItems,
    customPlugins.alignSelf,
    customPlugins.justifyContent,
    // justifyItems, // not needed tailwind names them correctly
    // justifySelf, // not needed tailwind names them correctly
    customPlugins.minMaxWidthHeightFromSpacing,
    customPlugins.fontSizeFromSpacing,
    customPlugins.textDecorationRenamed,
    customPlugins.lineHeightRenamed,
    customPlugins.letterSpacingRenamed,
    customPlugins.textTransformRenamed,
  ],
};
