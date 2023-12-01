import * as path from 'path';
import * as fs from 'fs';

import { Report } from './typings';

const getJsFilesNames = (baseDir: string, dirsNames: string[] = []) => {
    return dirsNames.reduce<string[]>((acc, dirName) => {
        try {
            const dirFilesNames = fs.readdirSync(path.resolve(baseDir, dirName));

            acc = [
                ...acc,
                ...dirFilesNames
                    .filter((fileName) => fileName.endsWith('.js'))
                    .map((fileName) => `${dirName}/${fileName}`),
            ];
        } catch {}

        return acc;
    }, []);
};

const getFilesSizes = (baseDir: string, filesPaths: string[]) => {
    return filesPaths.reduce<Report>((acc, filePath) => {
        try {
            const fileStat = fs.statSync(path.resolve(baseDir, filePath));

            acc[filePath] = fileStat.size;
        } catch {}

        return acc;
    }, {});
};

const getNormalizedHashedNamesMap = (names: string[], postfix = '') => {
    const hashedNamesCount: Record<string, number> = {};

    const hasHash = (str: string) => {
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test(str);
    };

    return names.reduce<Record<string, string>>((acc, nameOriginal) => {
        const splittedName = nameOriginal.slice(0, -postfix.length).split('-');

        if (hasHash(splittedName[splittedName.length - 1])) {
            const name = splittedName.slice(0, -1).join('');

            hashedNamesCount[name] = (hashedNamesCount[name] || 0) + 1;

            acc[nameOriginal] = `${name}-hash${hashedNamesCount[name]}${postfix}`;
        }

        return acc;
    }, {});
};

const normalizeObjectKeysByMap = <Obj extends Record<string, unknown>>(
    obj: Obj,
    normalizeMap: Record<string, string>,
): Obj => {
    return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[normalizeMap[key] || key] = value;

        return acc;
    }, {}) as Obj;
};

export const createReport = ({
    baseDir = __dirname,
    bundlesDirsNames = [],
}: {
    baseDir: string;
    bundlesDirsNames: string[];
}) => {
    const filesPaths = getJsFilesNames(baseDir, bundlesDirsNames);
    const normalizeHashedFilesPathsMap = getNormalizedHashedNamesMap(filesPaths, '.js');
    const filesSizesOriginal = getFilesSizes(baseDir, filesPaths);

    return normalizeObjectKeysByMap(filesSizesOriginal, normalizeHashedFilesPathsMap);
};
