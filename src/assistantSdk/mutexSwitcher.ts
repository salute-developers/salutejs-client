import { createMutexedObject } from './mutexedObject';

export const createMutexSwitcher = <Deps extends Record<string, boolean>>(
    { lock, release }: Pick<ReturnType<typeof createMutexedObject>, 'lock' | 'release'>,
    initialDeps: Deps,
) => {
    let deps = { ...initialDeps };

    return {
        change: (nextDeps: Partial<{ [key in keyof Deps]: boolean }>) => {
            deps = { ...deps, nextDeps };

            if (Object.values(deps).every((dep) => dep)) {
                release();
            } else {
                lock();
            }
        },
    };
};
