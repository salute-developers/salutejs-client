import { createNanoEvents } from './nanoevents';

export type ObserverFunc<T> = (data: T) => void;

interface Events<T extends Record<string, unknown>> {
    next: ObserverFunc<T>;
}

export interface Observer<T extends Record<string, unknown>> {
    next: ObserverFunc<T>;
}

export interface Observable<T extends Record<string, unknown>> {
    subscribe: (observer: Observer<T>) => { unsubscribe: () => void };
}

export const createNanoObservable = <T extends Record<string, unknown>>(
    observerFunc: (observer: Observer<T>) => void,
): Observable<T> => {
    const { on, emit } = createNanoEvents<Events<T>>();

    const subscribe = ({ next }: Observer<T>) => {
        const unsubscribe = on('next', next);
        return { unsubscribe };
    };

    observerFunc({
        next: (data: T) => {
            emit('next', data);
        },
    });

    return {
        subscribe,
    };
};
