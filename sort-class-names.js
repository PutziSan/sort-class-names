#!/usr/bin/env node
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fs = require("fs");
var magic_string_1 = require("magic-string");
var path = require("path");
var twClasses = Object.fromEntries(fs
    .readFileSync(fs.existsSync("sort-class-names-order-reference.csv")
    ? "sort-class-names-order-reference.csv"
    : path.join(__dirname, "sort-class-names-order-reference.csv"), "utf8")
    .split("\n")
    .map(function (c, i) { return [c.replace("\r", ""), i]; }));
function classNameToIndex(className) {
    return twClasses[className] || -1;
}
function classNamePartsToSortedString(parts) {
    var orderedClassNameParts = [];
    var classNameList = parts
        .filter(function (p) { return p.type === "classNames"; })
        .map(function (p) { return p.value; })
        .join(" ")
        .split(" ")
        .filter(Boolean)
        .map(function (cn) { return cn.trim(); })
        // ignore slash classes
        .filter(function (cn) { return cn !== "/"; });
    var prefixes = ["sm:", "md:", "lg:", "xl:"];
    var noPrefixClassNames = [];
    var prefixesHelper = prefixes.map(function (p) {
        return { prefix: p, classNames: [] };
    });
    classNameList.forEach(function (cn) {
        for (var _i = 0, prefixesHelper_1 = prefixesHelper; _i < prefixesHelper_1.length; _i++) {
            var _a = prefixesHelper_1[_i], prefix = _a.prefix, classNames = _a.classNames;
            if (cn.startsWith(prefix)) {
                classNames.push(cn);
                return;
            }
        }
        // wenn kein prefix passt, füge es den allgemeinen Klassen hinzu:
        noPrefixClassNames.push(cn);
    });
    // als erstes Klassen ohne Prefix
    __spreadArrays([{ prefix: "", classNames: noPrefixClassNames }], prefixesHelper).forEach(function (_a) {
        var classNames = _a.classNames, prefix = _a.prefix;
        var res = {};
        classNames.forEach(function (cn) {
            // nutze den bereinigten Klassen-Namen um den sortierungsindex herauszubekommen:
            var classNameWithoutPrefix = cn.substr(prefix.length);
            var sortIndex = classNameToIndex(classNameWithoutPrefix);
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
    });
    // zum Schluss alle Variablen hinzufügen:
    parts
        .filter(function (p) { return p.type === "variable"; })
        .forEach(function (p) { return orderedClassNameParts.push(p.value); });
    return orderedClassNameParts.join(" ");
}
function sort(srcText) {
    var attrName = srcText.indexOf("class=\"") >= 0 ? "class" : "className";
    var s = new magic_string_1["default"](srcText);
    var res = [];
    var endIndex = 0;
    while (true) {
        var firstStartIndex = srcText.indexOf(attrName + "=\"", endIndex);
        if (firstStartIndex < 0) {
            break;
        }
        firstStartIndex = firstStartIndex + (attrName + "=\"").length;
        endIndex = firstStartIndex;
        var nextTemplateVarIndex = firstStartIndex;
        endIndex = srcText.indexOf("\"", endIndex);
        nextTemplateVarIndex = srcText.indexOf("${", nextTemplateVarIndex);
        var classNameParts = [];
        var startIndex = firstStartIndex;
        while (nextTemplateVarIndex >= 0 && nextTemplateVarIndex < endIndex) {
            classNameParts.push({
                type: "classNames",
                value: srcText.substring(startIndex, nextTemplateVarIndex)
            });
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
            classNameParts.push({
                type: "variable",
                value: srcText.substring(nextTemplateVarIndex, closingBracketIndex + 1)
            });
            startIndex = closingBracketIndex + 1;
            endIndex = srcText.indexOf("\"", closingBracketIndex);
            nextTemplateVarIndex = srcText.indexOf("${", closingBracketIndex);
        }
        classNameParts.push({
            type: "classNames",
            value: srcText.substring(startIndex, endIndex)
        });
        if (classNameParts.length > 0 &&
            // leere elemente müssen ausgeschlossen werden
            endIndex > firstStartIndex) {
            s.overwrite(firstStartIndex, endIndex, classNamePartsToSortedString(classNameParts));
        }
    }
    return s.toString();
}
// prettier-ignore
var blacklist = { node: 1, yarn: 1, run: 1, "sort-class-names": 1, "sort-class-names.js": 1, "tw-scn": 1 };
var fileNames = process.argv.filter(function (f) { return !(f in blacklist); });
fileNames.forEach(function (fileName) {
    fs.writeFileSync(fileName, sort(fs.readFileSync(fileName, "utf8")), "utf8");
});
