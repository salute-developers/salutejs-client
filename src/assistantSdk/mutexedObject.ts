import { createNanoEvents } from '../nanoevents';

export type MutexedObjectEvents<A> = {
    'change-request': (object: Partial<A>) => void;
    change: (nextObject: Partial<A>, prevObject: Partial<A>) => void;
};

export type MutexedObject<A = Record<string, unknown>> = {
    on: <K extends keyof MutexedObjectEvents<A>>(event: K, cb: MutexedObjectEvents<A>[K]) => () => void;
    lock: () => void;
    release: () => void;
    change: (object: Partial<A>) => void;
    get: () => A;
};

export const createMutexedObject = <A extends Record<string, unknown>>(initialObject: A): MutexedObject<A> => {
    const { on, emit } = createNanoEvents<MutexedObjectEvents<A>>();

    let object = { ...initialObject };
    let nextObject: Partial<A> = {};
    let mode: 'locked' | 'released' = 'released';

    const tryApply = () => {
        if (mode === 'released') {
            const prevObject = object;

            object = {
                ...prevObject,
                ...nextObject,
            };

            const isSettingsChanged = Object.keys(nextObject).some((name) => nextObject[name] !== prevObject[name]);

            if (isSettingsChanged) {
                emit('change', object, prevObject);
            }
        }
    };

    const lock = () => {
        mode = 'locked';
    };

    const release = () => {
        mode = 'released';

        tryApply();
    };

    const change = (setts: Partial<A>) => {
        nextObject = {
            ...nextObject,
            ...setts,
        };

        emit('change-request', setts);
        tryApply();
    };

    return {
        on,
        lock,
        release,
        change,
        get: () => object,
    };
};
