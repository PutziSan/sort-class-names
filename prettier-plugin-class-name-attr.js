const prettierParserHTML = require("prettier/parser-html").default

const parsers = {
  html: {
    ...prettierParserHTML.parsers.html,
    parse: (text, parsers, options) => {
      const elementAST = prettierParserHTML.parsers.html.parse(text, parsers, options)

      const sortClassNames = require(options.sortClassNames)

      function sortClassAttr(el) {
        if (el.attrs) {
          const classAttr = el.attrs.find((attr) => attr.name === "class")
          if (classAttr && classAttr.value) {
            classAttr.value = sortClassNames(classAttr.value)
          }
        }

        if (el.children && el.children.length > 0) {
          el.children.forEach((childEl) => sortClassAttr(childEl))
        }
      }

      sortClassAttr(elementAST)
      return elementAST
    },
  },
}

module.exports = {
  languages: {
    name: "HTML",
    parsers: ["html"],
  },
  parsers,
  options: {
    sortClassNameAttrPath: {
      type: "string",
      category: "Global",
      default: false,
      description: ""
    }
  }
}
