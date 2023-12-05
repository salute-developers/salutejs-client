## Описание

Экспорт:

- `createReport({ baseDir: string, bundlesDirsNames: Array<string> })` – возвращает объект путь_к_файлу:размер_в_байтах.
- `createSummary({ prevReport: {}, nextReport: {} })` – принимает два объекта, описывающих размеры файлов (результаты `createReport()`). Возвращает markdown-строку – таблицу сравнения `nextReport` с `prevReport`.

## Сборка

Исходный код хранится в `./src`. Собирается при помощи `tsc` (командой `npm run build:tools`) в корневую директорию инструмента.
