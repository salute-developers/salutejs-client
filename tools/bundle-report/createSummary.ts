import { Report, Summary } from './typings';

type Row = Array<string | number>;

type RowsGroups = Record<string, Row[]>;

const colsIds = {
    fileName: 0,
    prevSize: 1,
    nextSize: 2,
    diffAbs: 3,
    diffPer: 4,
};

const colsTitles = [
    ['File name', 'Prev size', 'Next size', 'Diff (abs)', 'Diff (%)'],
    [':---', ':---:', ':---:', ':---:', ':---:'],
];

const toNumber = (value: number | string | undefined): number => {
    const returns = Number(value);

    return isNaN(returns) ? 0 : returns;
};

const createRows = (prevReport: Report, nextReport: Report) => {
    const rows: Row[] = [];
    // @ts-ignore – uses the --downlevelIteration flag
    const filesNames = [...new Set([...Object.keys(prevReport), ...Object.keys(nextReport)])];

    filesNames.forEach((fileName) => {
        const fileResult: Row = [];
        const prevSize = toNumber(prevReport[fileName]);
        const nextSize = toNumber(nextReport[fileName]);
        const diffAbs = toNumber(nextReport[fileName]) - prevSize;

        fileResult[colsIds.fileName] = fileName;
        fileResult[colsIds.prevSize] = prevSize;
        fileResult[colsIds.nextSize] = nextSize;
        fileResult[colsIds.diffAbs] = diffAbs;
        fileResult[colsIds.diffPer] = 0;

        try {
            fileResult[colsIds.diffPer] =
                prevSize === nextSize ? 0 : Math.round((diffAbs || prevSize) / ((prevSize || diffAbs) / 100));
        } catch {}

        rows.push(fileResult);
    });

    return rows;
};

const getTotalRow = (rows: Row[]) => {
    const total: Row = [];

    total[colsIds.fileName] = '**Total**';
    total[colsIds.prevSize] = rows.reduce((acc, row) => acc + (row[colsIds.prevSize] as number), 0);
    total[colsIds.nextSize] = rows.reduce((acc, row) => acc + (row[colsIds.nextSize] as number), 0);
    total[colsIds.diffAbs] = (total[colsIds.nextSize] as number) - (total[colsIds.prevSize] as number);
    total[colsIds.diffPer] = 0;

    try {
        total[colsIds.diffPer] =
            total[colsIds.prevSize] === total[colsIds.nextSize]
                ? 0
                : Math.round(
                      ((total[colsIds.diffAbs] as number) || (total[colsIds.prevSize] as number)) /
                          (((total[colsIds.prevSize] as number) || (total[colsIds.diffAbs] as number)) / 100),
                  );
    } catch {}

    return total;
};

const createMdSummary = (rowsGroups: RowsGroups = {}, unit: 'KB' = 'KB'): Summary => {
    const absNames: Array<keyof typeof colsIds> = ['prevSize', 'nextSize', 'diffAbs'];
    const perNames: Array<keyof typeof colsIds> = ['diffPer'];

    const rows = Object.entries(rowsGroups).reduce<Row[]>((acc, [groupTitle, groupRows]) => {
        if (acc.length) {
            acc.push([]);
        }

        acc.push([`📁 **\`${groupTitle}\`**`]);

        const parcedRows = groupRows.map((rowOriginal) => {
            const row = [...rowOriginal];

            absNames.map((absName) => {
                if (unit === 'KB') {
                    row[colsIds[absName]] = `${((row[colsIds[absName]] as number) / 1024).toFixed(2)} KB`;

                    if (absName === 'diffAbs') {
                        row[colsIds[absName]] = `**${row[colsIds[absName]]}**`;
                    }
                }
            });

            perNames.map((perName) => {
                row[colsIds[perName]] = `${row[colsIds[perName]]} %`;
            });

            return row;
        });

        acc = [...acc, ...parcedRows];

        return acc;
    }, []);

    return [...colsTitles, ...rows].map((line) => `|${line.join('|')}|`).join('\n');
};

const createRowsGroups = (prevReport: Report, nextReport: Report) => {
    const paths = [...new Set([...Object.keys(prevReport), ...Object.keys(nextReport)])];

    const reportsGroups = paths.reduce<Record<string, { prev: Report; next: Report }>>((acc, path) => {
        const pathSplitted = path.split('/');
        const hasDir = pathSplitted.length > 1;
        const groupName = `${hasDir ? pathSplitted[0] : '.'}/`;
        const fileName = hasDir ? path.slice(groupName.length) : path;

        if (!acc[groupName]) {
            acc[groupName] = {
                prev: {},
                next: {},
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

    return Object.entries(reportsGroups).reduce<RowsGroups>((acc, [groupName, { prev, next }]) => {
        const valuesRows = createRows(prev, next).sort((a, b) => {
            return (a[colsIds.fileName] as string).localeCompare(b[colsIds.fileName] as string);
        });
        const total = getTotalRow(valuesRows);

        acc[groupName] = [...valuesRows, total];

        return acc;
    }, {});
};

export const createSummary = ({ prevReport, nextReport }: { prevReport: Report; nextReport: Report }): Summary => {
    const rowsGroups = createRowsGroups(prevReport, nextReport);

    return createMdSummary(rowsGroups);
};
