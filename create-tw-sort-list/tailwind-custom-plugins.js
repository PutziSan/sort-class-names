const prefixNegativeModifiers = require("tailwindcss/lib/util/prefixNegativeModifiers.js").default;
const createUtilityPlugin = require("tailwindcss/lib/util/createUtilityPlugin.js").default;

function alignContent({ addUtilities, variants }) {
  addUtilities(
    {
      ".align-content-start": {
        "align-content": "flex-start",
      },
      ".align-content-end": {
        "align-content": "flex-end",
      },
      ".align-content-center": {
        "align-content": "center",
      },
      ".align-content-between": {
        "align-content": "space-between",
      },
      ".align-content-around": {
        "align-content": "space-around",
      },
    },
    variants("alignContent")
  );
}

function alignItems({ addUtilities, variants }) {
  addUtilities(
    {
      ".align-items-start": {
        "align-items": "flex-start",
      },
      ".align-items-end": {
        "align-items": "flex-end",
      },
      ".align-items-center": {
        "align-items": "center",
      },
      ".align-items-stretch": {
        "align-items": "stretch",
      },
      ".align-items-baseline": {
        "align-items": "baseline",
      },
    },
    variants("alignItems")
  );
}

function alignSelf({ addUtilities, variants }) {
  addUtilities(
    {
      ".align-self-start": {
        "align-self": "flex-start",
      },
      ".align-self-end": {
        "align-self": "flex-end",
      },
      ".align-self-center": {
        "align-self": "center",
      },
      ".align-self-stretch": {
        "align-self": "stretch",
      },
      ".align-self-auto": {
        "align-self": "auto",
      },
    },
    variants("alignSelf")
  );
}

function justifyContent({ addUtilities, variants }) {
  addUtilities(
    {
      ".justify-content-start": {
        "justify-content": "flex-start",
      },
      ".justify-content-end": {
        "justify-content": "flex-end",
      },
      ".justify-content-center": {
        "justify-content": "center",
      },
      ".justify-content-between": {
        "justify-content": "space-between",
      },
      ".justify-content-around": {
        "justify-content": "space-around",
      },
    },
    variants("justifyContent")
  );
}

function minMaxWidthHeightFromSpacing({ addUtilities, e, theme, variants }) {
  let utilities = {};
  function add(key, value) {
    utilities[`.${e(key)}`] = value;
  }
  const spacing = theme("spacing");
  Object.keys(spacing).forEach((key) => {
    const value = spacing[key];
    add(prefixNegativeModifiers("max-w", key), { maxWidth: `${value}` });
    add(prefixNegativeModifiers("max-h", key), { maxHeight: `${value}` });
    add(prefixNegativeModifiers("min-w", key), { minWidth: `${value}` });
    add(prefixNegativeModifiers("min-h", key), { minHeight: `${value}` });
  });
  addUtilities(utilities, variants("inset"));
}

function fontSizeFromSpacing({ addUtilities, e, theme, variants }) {
  let utilities = {};
  function add(key, value) {
    utilities[`.${e(key)}`] = value;
  }
  const spacing = theme("spacing");
  Object.keys(spacing).forEach((key) => {
    const value = spacing[key];
    if (value < 0) {
      return;
    }
    add(`font-size-${key}`, { "font-size": `${value}` });
  });
  addUtilities(utilities, variants("fontSize"));
}

function textDecorationRenamed() {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        "text-decoration-underline": { "text-decoration": "underline" },
        "text-decoration-line-through": { "text-decoration": "line-through" },
        "text-decoration-none": { "text-decoration": "none" },
      },
      variants("textDecoration")
    );
  };
}

const lineHeightRenamed = createUtilityPlugin("lineHeight", [["line-height", ["lineHeight"]]]);
const letterSpacingRenamed = createUtilityPlugin("letterSpacing", [["letter-spacing", ["letterSpacing"]]]);

function textTransformRenamed() {
  return function ({ addUtilities, variants }) {
    addUtilities(
      {
        "text-transform-uppercase": { "text-transform": "uppercase" },
        "text-transform-lowercase": { "text-transform": "lowercase" },
        "text-transform-capitalize": { "text-transform": "capitalize" },
        "text-transform-none": { "text-transform": "none" },
      },
      variants("textTransform")
    );
  };
}

module.exports = {
  alignContent,
  alignItems,
  alignSelf,
  justifyContent,
  minMaxWidthHeightFromSpacing,
  fontSizeFromSpacing,
  lineHeightRenamed,
  letterSpacingRenamed,
  textDecorationRenamed,
  textTransformRenamed,
}