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
exports.createSummary = void 0;
var colsIds = {
    fileName: 0,
    prevSize: 1,
    nextSize: 2,
    diffAbs: 3,
    diffPer: 4
};
var colsTitles = [
    ['File name', 'Prev size', 'Next size', 'Diff (abs)', 'Diff (%)'],
    [':---', ':---:', ':---:', ':---:', ':---:'],
];
var toNumber = function (value) {
    var returns = Number(value);
    return isNaN(returns) ? 0 : returns;
};
var createRows = function (prevReport, nextReport) {
    var rows = [];
    // @ts-ignore – uses the --downlevelIteration flag
    var filesNames = __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(Object.keys(prevReport))), __read(Object.keys(nextReport))))));
    filesNames.forEach(function (fileName) {
        var fileResult = [];
        var prevSize = toNumber(prevReport[fileName]);
        var nextSize = toNumber(nextReport[fileName]);
        var diffAbs = toNumber(nextReport[fileName]) - prevSize;
        fileResult[colsIds.fileName] = fileName;
        fileResult[colsIds.prevSize] = prevSize;
        fileResult[colsIds.nextSize] = nextSize;
        fileResult[colsIds.diffAbs] = diffAbs;
        fileResult[colsIds.diffPer] = 0;
        try {
            fileResult[colsIds.diffPer] =
                prevSize === nextSize ? 0 : Math.round((diffAbs || prevSize) / ((prevSize || diffAbs) / 100));
        }
        catch (_a) { }
        rows.push(fileResult);
    });
    return rows;
};
var getTotalRow = function (rows) {
    var total = [];
    total[colsIds.fileName] = '**Total**';
    total[colsIds.prevSize] = rows.reduce(function (acc, row) { return acc + row[colsIds.prevSize]; }, 0);
    total[colsIds.nextSize] = rows.reduce(function (acc, row) { return acc + row[colsIds.nextSize]; }, 0);
    total[colsIds.diffAbs] = total[colsIds.nextSize] - total[colsIds.prevSize];
    total[colsIds.diffPer] = 0;
    try {
        total[colsIds.diffPer] =
            total[colsIds.prevSize] === total[colsIds.nextSize]
                ? 0
                : Math.round((total[colsIds.diffAbs] || total[colsIds.prevSize]) /
                    ((total[colsIds.prevSize] || total[colsIds.diffAbs]) / 100));
    }
    catch (_a) { }
    return total;
};
var createMdSummary = function (rowsGroups, unit) {
    if (rowsGroups === void 0) { rowsGroups = {}; }
    if (unit === void 0) { unit = 'KB'; }
    var absNames = ['prevSize', 'nextSize', 'diffAbs'];
    var perNames = ['diffPer'];
    var rows = Object.entries(rowsGroups).reduce(function (acc, _a) {
        var _b = __read(_a, 2), groupTitle = _b[0], groupRows = _b[1];
        if (acc.length) {
            acc.push([]);
        }
        acc.push(["\uD83D\uDCC1 **`" + groupTitle + "`**"]);
        var parcedRows = groupRows.map(function (rowOriginal) {
            var row = __spreadArray([], __read(rowOriginal));
            absNames.map(function (absName) {
                if (unit === 'KB') {
                    row[colsIds[absName]] = (row[colsIds[absName]] / 1024).toFixed(2) + " KB";
                    if (absName === 'diffAbs') {
                        row[colsIds[absName]] = "**" + row[colsIds[absName]] + "**";
                    }
                }
            });
            perNames.map(function (perName) {
                row[colsIds[perName]] = row[colsIds[perName]] + " %";
            });
            return row;
        });
        acc = __spreadArray(__spreadArray([], __read(acc)), __read(parcedRows));
        return acc;
    }, []);
    return __spreadArray(__spreadArray([], __read(colsTitles)), __read(rows)).map(function (line) { return "|" + line.join('|') + "|"; }).join('\n');
};
var createRowsGroups = function (prevReport, nextReport) {
    var paths = __spreadArray([], __read(new Set(__spreadArray(__spreadArray([], __read(Object.keys(prevReport))), __read(Object.keys(nextReport))))));
    var reportsGroups = paths.reduce(function (acc, path) {
        var pathSplitted = path.split('/');
        var hasDir = pathSplitted.length > 1;
        var groupName = (hasDir ? pathSplitted[0] : '.') + "/";
        var fileName = hasDir ? path.slice(groupName.length) : path;
        if (!acc[groupName]) {
            acc[groupName] = {
                prev: {},
                next: {}
            };
        }
        if (typeof prevReport[path] === 'number') {
            acc[groupName].prev[fileName] = prevReport[path];
        }
        if (typeof nextReport[path] === 'number') {
            acc[groupName].next[fileName] = nextReport[path];
        }
        return acc;
    }, {});
    return Object.entries(reportsGroups).reduce(function (acc, _a) {
        var _b = __read(_a, 2), groupName = _b[0], _c = _b[1], prev = _c.prev, next = _c.next;
        var valuesRows = createRows(prev, next).sort(function (a, b) {
            return a[colsIds.fileName].localeCompare(b[colsIds.fileName]);
        });
        var total = getTotalRow(valuesRows);
        acc[groupName] = __spreadArray(__spreadArray([], __read(valuesRows)), [total]);
        return acc;
    }, {});
};
var createSummary = function (_a) {
    var prevReport = _a.prevReport, nextReport = _a.nextReport;
    var rowsGroups = createRowsGroups(prevReport, nextReport);
    return createMdSummary(rowsGroups);
};
exports.createSummary = createSummary;
