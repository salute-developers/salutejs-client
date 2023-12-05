"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.createReport = void 0;
var path = require("path");
var fs = require("fs");
var getJsFilesNames = function (baseDir, dirsNames) {
    if (dirsNames === void 0) { dirsNames = []; }
    return dirsNames.reduce(function (acc, dirName) {
        try {
            var dirFilesNames = fs.readdirSync(path.resolve(baseDir, dirName));
            acc = __spreadArray(__spreadArray([], __read(acc)), __read(dirFilesNames
                .filter(function (fileName) { return fileName.endsWith('.js'); })
                .map(function (fileName) { return dirName + "/" + fileName; })));
        }
        catch (_a) { }
        return acc;
    }, []);
};
var getFilesSizes = function (baseDir, filesPaths) {
    return filesPaths.reduce(function (acc, filePath) {
        try {
            var fileStat = fs.statSync(path.resolve(baseDir, filePath));
            acc[filePath] = fileStat.size;
        }
        catch (_a) { }
        return acc;
    }, {});
};
var getNormalizedHashedNamesMap = function (names, postfix) {
    if (postfix === void 0) { postfix = ''; }
    var hashedNamesCount = {};
    var hasHash = function (str) {
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test(str);
    };
    return names.reduce(function (acc, nameOriginal) {
        var splittedName = nameOriginal.slice(0, -postfix.length).split('-');
        if (hasHash(splittedName[splittedName.length - 1])) {
            var name_1 = splittedName.slice(0, -1).join('');
            hashedNamesCount[name_1] = (hashedNamesCount[name_1] || 0) + 1;
            acc[nameOriginal] = name_1 + "-hash" + hashedNamesCount[name_1] + postfix;
        }
        return acc;
    }, {});
};
var normalizeObjectKeysByMap = function (obj, normalizeMap) {
    return Object.entries(obj).reduce(function (acc, _a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        acc[normalizeMap[key] || key] = value;
        return acc;
    }, {});
};
var createReport = function (_a) {
    var _b = _a.baseDir, baseDir = _b === void 0 ? __dirname : _b, _c = _a.bundlesDirsNames, bundlesDirsNames = _c === void 0 ? [] : _c;
    var filesPaths = getJsFilesNames(baseDir, bundlesDirsNames);
    var normalizeHashedFilesPathsMap = getNormalizedHashedNamesMap(filesPaths, '.js');
    var filesSizesOriginal = getFilesSizes(baseDir, filesPaths);
    return normalizeObjectKeysByMap(filesSizesOriginal, normalizeHashedFilesPathsMap);
};
exports.createReport = createReport;
