"use strict";
exports.__esModule = true;
var magic_string_1 = require("magic-string");
var fs = require("fs");
var twClasses = Object.fromEntries(fs
    .readFileSync("tailwind-sort-class-name-list.csv", "utf8")
    .split("\n")
    .map(function (c, i) { return [c, i]; }));
function classNameToIndex(className) {
    return twClasses[className] || -1;
}
function classNamePartsToSortedString(parts) {
    var orderedClassNameParts = [];
    var res = {};
    var classNameParts = parts.filter(function (p) { return p.type === "classNames"; });
    ["", "sm:", "md:", "lg:", "xl:"].forEach(function (prefix) {
        // TODO sache mit prefix reinnehmen, sodass sm lg usw richtig und gut gruppiert wird:
    });
    parts
        .filter(function (p) { return p.type === "classNames"; })
        .map(function (p) { return p.value; })
        .join(" ")
        .split(" ")
        .filter(Boolean)
        .map(function (cn) { return cn.trim(); })
        .forEach(function (cn) {
        if (cn === "/") {
            // ignore slash classes
            return;
        }
        var sortIndex = classNameToIndex(cn);
        var arr = res[sortIndex.toString()];
        if (!arr) {
            arr = [];
            res[sortIndex.toString()] = arr;
        }
        arr.push(cn);
    });
    var numberKeys = Object.keys(res).map(function (k) { return Number(k); });
    numberKeys
        .sort(function (a, b) { return a - b; })
        .forEach(function (key) {
        orderedClassNameParts.push(res[key.toString()].sort().join(" "));
        if (key < 0 && numberKeys.some(function (k) { return k >= 0; })) {
            orderedClassNameParts.push("/");
        }
    });
    parts.filter(function (p) { return p.type === "variable"; }).forEach(function (p) { return orderedClassNameParts.push(p.value); });
    return orderedClassNameParts.join(" ");
}
function sort(srcText) {
    var s = new magic_string_1["default"](srcText);
    var res = [];
    var endIndex = 0;
    while (true) {
        var firstStartIndex = srcText.indexOf("class=\"", endIndex);
        if (firstStartIndex < 0) {
            break;
        }
        firstStartIndex = firstStartIndex + "class=\"".length;
        endIndex = firstStartIndex;
        var nextTemplateVarIndex = firstStartIndex;
        endIndex = srcText.indexOf("\"", endIndex);
        nextTemplateVarIndex = srcText.indexOf("${", nextTemplateVarIndex);
        var classNameParts = [];
        var startIndex = firstStartIndex;
        while (nextTemplateVarIndex >= 0 && nextTemplateVarIndex < endIndex) {
            classNameParts.push({ type: "classNames", value: srcText.substring(startIndex, nextTemplateVarIndex) });
            var closingBracketIndex = nextTemplateVarIndex + "${".length;
            // start bei 1, da wir wissen dass die erste öffnende Klammer schon existiert
            var counter = 1;
            while (counter > 0) {
                var char = srcText.charAt(closingBracketIndex);
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
            classNameParts.push({ type: "variable", value: srcText.substring(nextTemplateVarIndex, closingBracketIndex + 1) });
            startIndex = closingBracketIndex + 1;
            endIndex = srcText.indexOf("\"", closingBracketIndex);
            nextTemplateVarIndex = srcText.indexOf("${", closingBracketIndex);
        }
        classNameParts.push({ type: "classNames", value: srcText.substring(startIndex, endIndex) });
        if (classNameParts.length > 0 &&
            // leere elemente müssen ausgeschlossen werden
            endIndex > firstStartIndex) {
            s.overwrite(firstStartIndex, endIndex, classNamePartsToSortedString(classNameParts));
        }
    }
    return s.toString();
}
var fileName = process.argv[2];
var newCodeContent = sort(fs.readFileSync(fileName, "utf8"));
fs.writeFileSync(fileName, newCodeContent, "utf8");
