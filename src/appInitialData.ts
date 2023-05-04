import { AssistantClientCommand, AssistantClientCustomizedCommand, AssistantSmartAppCommand } from './typings';

type AnyObject = { [key: string]: unknown };

const isDeepEqual = (a: AnyObject | unknown, b: AnyObject | unknown): boolean => {
    // Простое значение
    if (typeof a !== 'object' || a === null) {
        return a === b;
    }

    // Массив
    if (Array.isArray(a)) {
        if (!Array.isArray(b) || a.length !== b.length) {
            return false;
        }

        return !a.some((valA: unknown, key: number) => !isDeepEqual(valA, b[key]));
    }

    // Словарь
    if (typeof b !== 'object' || b === null) {
        return false;
    }

    const entriesA = Object.entries(a);
    const entriesB = Object.entries(b);

    if (entriesA.length !== entriesB.length) {
        return false;
    }

    return !entriesA.some(([key, valA]: [string, unknown]) => !(key in b && isDeepEqual(valA, (b as AnyObject)[key])));
};

const findCommandIndex = (arr: AssistantClientCommand[], command: AssistantClientCommand) => {
    const insets = ['insets', 'minimum_static_insets', 'maximum_static_insets', 'dynamic_insets'];
    let index = -1;

    if (command.type === 'character') {
        index = arr.findIndex((c) => c.type === 'character' && c.character.id === command.character.id);
    } else if (insets.includes(command.type)) {
        index = arr.findIndex((c) => c.type === command.type);
    } else if (command.type === 'app_context') {
        index = arr.findIndex((c) => c.type === 'app_context');
    } else {
        index = arr.findIndex((c) => isDeepEqual(c, command));
    }

    return index;
};

export const appInitialData = (() => {
    let isPulled = false;
    let pulled: Array<AssistantClientCommand> = [];
    let committed: Array<AssistantClientCommand> = [];
    let diff: Array<AssistantClientCommand> = [];

    const isCommandWasPulled = (command: AssistantClientCommand) => findCommandIndex(pulled, command) >= 0;

    return {
        /**
         * Прочитать appInitialData. Запоминает состояние на момент прочтения
         * @returns Массив комманд
         */
        pull: () => {
            isPulled = true;
            pulled = [...(window.appInitialData || [])];

            return [...pulled];
        },
        /**
         * Прочитать appInitialData
         * @returns Массив комманд
         */
        get: () => [...(window.appInitialData || [])],
        /**
         * Зафиксировать текущее состояние appInitialData
         */
        commit: () => {
            committed = [...(window.appInitialData || [])];
            diff =
                isPulled === true
                    ? (window.appInitialData || []).filter((c) => !isCommandWasPulled(c))
                    : [...(window.appInitialData || [])];
        },
        /**
         * Возвращает диф appInitialData между pull и commit
         * @returns Массив комманд
         */
        diff: () => {
            return [...diff];
        },
        /**
         * Возвращает флаг наличия command в appInitialData на момент commit
         * @param command Команда, которую нужно проверить на наличие в appInitialData
         * @returns true - если команда была в appInitialData
         */
        isCommitted: (command: AssistantClientCommand) => {
            const commandIndex = findCommandIndex(committed, command);
            const isCommitted = commandIndex >= 0;

            if (isCommitted) {
                committed.splice(commandIndex, 1);
            }

            return isCommitted;
        },
        /**
         * Возвращает первое сообщение из appInitialData, подходящее под фильтры param
         * @param param Параметры: тип сообщения (например, smart_app_data)
         * и тип команды (значение поля smart_app_data.type)
         * @returns Первое сообщение, соответствующее параметрам или undefined
         */
        find: <T>({ type, command }: { type?: string; command?: string }): T | undefined => {
            const initialCommands = [...(window.appInitialData || [])];
            const result = initialCommands.find((initialCommand) => {
                if (!command && type && type === initialCommand.type) {
                    return true;
                }

                const isCommandInSmartAppData = command && 'smart_app_data' in initialCommand;

                if (!isCommandInSmartAppData) {
                    return;
                }

                if (
                    command === (initialCommand.smart_app_data as unknown as { command: string }).command ||
                    command === (initialCommand.smart_app_data as AssistantSmartAppCommand['smart_app_data']).type
                ) {
                    return true;
                }

                return false;
            }) as AssistantClientCustomizedCommand<AssistantSmartAppCommand>;

            return (result && 'smart_app_data' in result ? result.smart_app_data : result) as unknown as T;
        },
    };
})();
