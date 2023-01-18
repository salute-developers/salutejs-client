import { createNanoEvents } from '../nanoevents';

export type MutexedObjectEvents<A> = {
    'change-request': (object: Partial<A>) => void;
    changed: (nextObject: Partial<A>, prevObject: Partial<A>) => void;
};

export type MutexedObject<A = Record<string, unknown>> = {
    on: <K extends keyof MutexedObjectEvents<A>>(event: K, cb: MutexedObjectEvents<A>[K]) => () => void;
    lock: () => void;
    release: () => void;
    change: (object: Partial<A>) => void;
    current: A;
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

            const isObjectChanged = Object.keys(nextObject).some((name) => nextObject[name] !== prevObject[name]);

            if (isObjectChanged) {
                emit('changed', object, prevObject);
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

    const current: Partial<A> = {};

    Object.keys(initialObject).forEach((prop) => {
        Object.defineProperty(current, prop, {
            get() {
                return object[prop];
            },
        });
    });

    return {
        on,
        lock,
        release,
        change,
        current: current as A,
    };
};
