import { AppInfo } from '../typings';

import { DEFAULT_APP } from './const';

export function convertFieldValuesToString<
    Obj extends Record<string, unknown>,
    ObjStringified = { [key in keyof Obj]: string },
>(object: Obj): ObjStringified {
    return Object.keys(object).reduce((acc: Record<string, string>, key: string) => {
        if (object[key]) {
            acc[key] =
                typeof object[key] === 'string' && object[key].startsWith('{')
                    ? object[key]
                    : JSON.stringify(object[key]);
        }

        return acc;
    }, {}) as ObjStringified;
}
export const isDefaultApp = (appInfo: AppInfo) => appInfo.frontendStateId === DEFAULT_APP.frontendStateId;
export const promiseTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
    let timeoutId: number | undefined;
    return Promise.race([
        promise.then((v) => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            return v;
        }),
        new Promise<never>((_, reject) => {
            timeoutId = window.setTimeout(() => {
                reject(new Error(`Timed out in ${timeout} ms.`));
            }, timeout);
        }),
    ]);
};
