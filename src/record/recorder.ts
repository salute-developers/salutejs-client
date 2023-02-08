import { ClientLogger } from '../typings';

export interface RecorderUpdater<R extends object> {
    (updateCallback: (record: R) => void): void;
}
export interface RecorderHandlerPreparer {
    (handler: ClientLogger): ClientLogger;
}
export interface Recorder<R extends Record<string, unknown>> {
    stop: () => void;
    start: () => void;
    handler: ClientLogger;
    getRecord: () => R;
}
export interface BaseRecorder<R extends Record<string, unknown>> extends Recorder<R> {
    prepareHandler: RecorderHandlerPreparer;
    updateRecord: RecorderUpdater<R>;
}

export interface BaseRecorderCreator<R extends Record<string, unknown>> {
    (defaultActive?: boolean): Recorder<R>;
}

export const createBaseRecorder = <R extends Record<string, unknown>>(
    isActive = true,
    getDefaultRecord: () => R,
): BaseRecorder<R> => {
    let record = getDefaultRecord();

    const start = () => {
        record = getDefaultRecord();
        isActive = true;
    };

    const stop = () => {
        isActive = false;
    };

    function handler() {}

    const updateRecord: RecorderUpdater<R> = (cb) => cb(record);

    const getRecord = () => record;

    const prepareHandler: RecorderHandlerPreparer = (handlerToPrepare) => (...args) => {
        if (isActive === false) {
            return;
        }

        handlerToPrepare(...args);
    };

    return {
        getRecord,
        updateRecord,
        prepareHandler,
        handler,
        stop,
        start,
    };
};
