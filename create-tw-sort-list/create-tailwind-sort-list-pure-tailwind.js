const resolveConfig = require("tailwindcss/lib/util/resolveConfig").default;
const defaultConfig = require("tailwindcss/defaultConfig");
const _ = require("lodash");
// const customPlugins = require("./tailwind-custom-plugins");

const path = require("path");
const appDir = path.dirname(require.main.filename);
const userConfigPath = path.join(appDir, "tailwind.config.js");
const config = resolveConfig([
  // if you want to use your custom config then uncomment following line:
  // userConfigPath
  defaultConfig
]);

const plugins = [
  // "accessibility",
  "position",
  "inset",

  "overflow",

  "float",

  "margin",

  "alignSelf",

  "flex",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "order",

  "display",
  "flexDirection",

  "gap",

  "alignContent",
  "alignItems",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  // customPlugins.alignContent,
  // customPlugins.alignItems,
  // customPlugins.alignSelf,
  // customPlugins.justifyContent,

  "space",

  "boxSizing",

  { className: ".container" },

  "width",
  "height",

  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  // customPlugins.minMaxWidthHeightFromSpacing,

  "objectFit",
  "objectPosition",

  "padding",

  "zIndex",
  "visibility",

  "borderWidth",
  "borderStyle",
  "borderRadius",
  "borderColor",
  "borderCollapse",
  "borderOpacity",
  "divideColor",
  "divideOpacity",
  "divideWidth",

  "outline",

  "backgroundColor",
  "textColor",

  "fontFamily",
  "fontSize",
  // customPlugins.fontSizeFromSpacing,
  "fontWeight",
  "fontStyle",
  "fontSmoothing",
  "textAlign",
  "verticalAlign",
  "textDecoration",
  // customPlugins.textDecorationRenamed,
  "textOpacity",
  "textTransform",
  // customPlugins.textTransformRenamed,
  "letterSpacing",
  // customPlugins.letterSpacingRenamed,
  "lineHeight",
  // customPlugins.lineHeightRenamed,
  "whitespace",
  "wordBreak",

  "transform",
  "transformOrigin",
  "opacity",
  "translate",
  "rotate",
  "scale",
  "skew",

  // "appearance",
  "backgroundPosition",
  "backgroundSize",
  "backgroundRepeat",
  "backgroundOpacity",
  "backgroundAttachment",

  "transitionProperty",
  "transitionDuration",
  "transitionTimingFunction",
  "transitionDelay",

  "boxShadow",
  // "clear",
  // "cursor",
  // "fill",

  // "listStylePosition",
  // "listStyleType",

  // "placeholderColor",
  // "placeholderOpacity",
  // "pointerEvents",
  // "preflight",
  // "resize",

  // "stroke",
  // "strokeWidth",
  // "tableLayout",

  // "userSelect",
];

function cleanClassName(str) {
  str = str.substring(1);
  if (str.indexOf(" ") >= 0) {
    str = str.substr(0, str.indexOf(" "));
  }
  return str;
}

let res = [];

const applyConfiguredPrefix = (selector) => {
  const prefixSelector = require("tailwindcss/lib/util/prefixSelector");
  return prefixSelector(config.prefix, selector);
};
const getConfigValue = (path, defaultValue) =>
  _.get(config, path, defaultValue);

plugins.forEach((plugin) => {
  if (plugin.className) {
    res.push(cleanClassName(plugin.className));
    return;
  }

  let handler = plugin;
  if (typeof handler === "string") {
    handler = require(`tailwindcss/lib/plugins/${plugin}`);
    if (handler.default) {
      handler = handler.default;
    }
    handler = handler();
  }

  handler = typeof handler === "function" ? handler : plugin.handler;

  if (typeof handler !== "function") {
    console.log(plugin, typeof handler);
    console.log(require(`tailwindcss/lib/plugins/${plugin}`));
  }

  handler({
    config: getConfigValue,
    theme: (path, defaultValue) =>
      getConfigValue(`theme.${path}`, defaultValue),
    corePlugins: (path) => {
      if (Array.isArray(config.corePlugins)) {
        return config.corePlugins.includes(path);
      }

      return getConfigValue(`corePlugins.${path}`, true);
    },
    variants: (path, defaultValue) => {
      if (Array.isArray(config.variants)) {
        return config.variants;
      }

      return getConfigValue(`variants.${path}`, defaultValue);
    },
    target: (path) => {
      if (_.isString(config.target)) {
        return config.target === "browserslist"
          ? browserslistTarget
          : config.target;
      }

      const [defaultTarget, targetOverrides] = getConfigValue("target");

      return _.get(targetOverrides, path, defaultTarget);
    },
    e: require("tailwindcss/lib/util/escapeClassName").default,
    prefix: applyConfiguredPrefix,
    addUtilities: (utilities) => {
      if (Array.isArray(utilities)) {
        utilities.forEach((u) => {
          Object.keys(u).forEach((cn) => res.push(cleanClassName(cn)));
        });
      } else {
        Object.keys(utilities).forEach((cn) => res.push(cleanClassName(cn)));
      }
    },
    addComponents: (components) => {},
    addBase: () => {},
    addVariant: () => {},
  });
});

require("fs").writeFileSync(
  "prettier-plugin-sort-class-names-order",
  res
    .filter(Boolean)
    .map((c) => c.replace(/\\/g, ""))
    .join("\n"),
  "utf8"
);
