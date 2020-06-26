import MagicString from "magic-string";
import * as fs from "fs";
import * as path from "path";

type ClassNamePart = { type: "classNames" | "variable"; value: string };

const twClasses: { [key: string]: number } = Object.fromEntries(
  fs
    .readFileSync("tailwind-sort-class-name-list.csv", "utf8")
    .split("\n")
    .map((c, i) => [c, i])
);

function classNameToIndex(className: string) {
  return twClasses[className] || -1;
}

function classNamePartsToSortedString(parts: ClassNamePart[]) {
  const orderedClassNameParts: string[] = [];

  const classNameList = parts
    .filter((p) => p.type === "classNames")
    .map((p) => p.value)
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map((cn) => cn.trim())
    // ignore slash classes
    .filter((cn) => cn !== "/");

  const prefixes = ["sm:", "md:", "lg:", "xl:"];
  const noPrefixClassNames: string[] = [];
  const prefixesHelper = prefixes.map((p) => {
    return { prefix: p, classNames: [] };
  });

  classNameList.forEach((cn) => {
    for (const { prefix, classNames } of prefixesHelper) {
      if (cn.startsWith(prefix)) {
        classNames.push(cn);
        return;
      }
    }
    // wenn kein prefix passt, füge es den allgemeinen Klassen hinzu:
    noPrefixClassNames.push(cn);
  });

  // als erstes Klassen ohne Prefix
  [{ prefix: "", classNames: noPrefixClassNames }, ...prefixesHelper].forEach(
    ({ classNames, prefix }) => {
      const res: { [key: string]: string[] } = {};
      classNames.forEach((cn) => {
        // nutze den bereinigten Klassen-Namen um den sortierungsindex herauszubekommen:
        const classNameWithoutPrefix = cn.substr(prefix.length);
        const sortIndex = classNameToIndex(classNameWithoutPrefix);

        let arr = res[sortIndex.toString()];
        if (!arr) {
          arr = [];
          res[sortIndex.toString()] = arr;
        }

        arr.push(cn);
      });
      const numberKeys = Object.keys(res).map((k) => Number(k));
      numberKeys
        .sort((a, b) => a - b)
        .forEach((key) => {
          orderedClassNameParts.push(res[key.toString()].sort().join(" "));
          if (key < 0 && numberKeys.some((k) => k >= 0)) {
            orderedClassNameParts.push("/");
          }
        });
    }
  );

  // zum Schluss alle Variablen hinzufügen:
  parts
    .filter((p) => p.type === "variable")
    .forEach((p) => orderedClassNameParts.push(p.value));
  return orderedClassNameParts.join(" ");
}

function sort(srcText: string) {
  const s = new MagicString(srcText);
  const res = [];

  let endIndex = 0;

  while (true) {
    let firstStartIndex = srcText.indexOf(`class="`, endIndex);
    if (firstStartIndex < 0) {
      break;
    }

    firstStartIndex = firstStartIndex + `class="`.length;
    endIndex = firstStartIndex;
    let nextTemplateVarIndex = firstStartIndex;

    endIndex = srcText.indexOf(`"`, endIndex);
    nextTemplateVarIndex = srcText.indexOf("${", nextTemplateVarIndex);

    let classNameParts: ClassNamePart[] = [];

    let startIndex = firstStartIndex;
    while (nextTemplateVarIndex >= 0 && nextTemplateVarIndex < endIndex) {
      classNameParts.push({
        type: "classNames",
        value: srcText.substring(startIndex, nextTemplateVarIndex),
      });

      let closingBracketIndex = nextTemplateVarIndex + "${".length;
      // start bei 1, da wir wissen dass die erste öffnende Klammer schon existiert
      let counter = 1;
      while (counter > 0) {
        const char = srcText.charAt(closingBracketIndex);
        switch (char) {
          case "{":
            counter++;
            break;
          case "}":
            counter--;
            break;
          case "":
            // finished, stop something is werid;
            return;
        }

        if (counter !== 0) {
          closingBracketIndex++;
        }
      }

      classNameParts.push({
        type: "variable",
        value: srcText.substring(nextTemplateVarIndex, closingBracketIndex + 1),
      });

      startIndex = closingBracketIndex + 1;
      endIndex = srcText.indexOf(`"`, closingBracketIndex);
      nextTemplateVarIndex = srcText.indexOf("${", closingBracketIndex);
    }

    classNameParts.push({
      type: "classNames",
      value: srcText.substring(startIndex, endIndex),
    });

    if (
      classNameParts.length > 0 &&
      // leere elemente müssen ausgeschlossen werden
      endIndex > firstStartIndex
    ) {
      s.overwrite(
        firstStartIndex,
        endIndex,
        classNamePartsToSortedString(classNameParts)
      );
    }
  }

  return s.toString();
}

const fileName = process.argv[2];
const newCodeContent = sort(fs.readFileSync(fileName, "utf8"));

fs.writeFileSync(fileName, newCodeContent, "utf8");
