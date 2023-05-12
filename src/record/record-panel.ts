import { createComponent, CreateComponentParams } from '../createComponent';
import { RecordSaver } from '../typings';

import { Recorder } from './recorder';

export type RecordPanelProps = {
    recorder: Recorder;
    onSave: (record: object) => void;
};

type State = {
    isRecording: boolean;
    record: object | null;
};

type Refs = {
    RecordPanel: HTMLDivElement;
    ButtonStart: HTMLButtonElement;
    ButtonStop: HTMLButtonElement;
    ButtonSave: HTMLButtonElement;
    ButtonCopy: HTMLButtonElement;
};

const styles = `
    .recordPanel {
        position: fixed;
        z-index: 999;
        top: 0;
        right: 0;
    }

    .recordButton {
        margin-right: 8px;
        margin-top: 8px;
    }
`;

const template = `
    <div id="RecordPanel" className="recordPanel">
        <style>${styles}</style>
        <button id="RecordButtonStart" className="recordButton" type="button">start</button>
        <button id="RecordButtonStop" className="recordButton" type="button">stop</button>
        <button id="RecordButtonSave" className="recordButton" type="button">save</button>
        <button id="RecordButtonCopy" className="recordButton" type="button">copy</button>
    </div>
`;

const defaultState = {
    isRecording: true,
    record: null,
};

const render: CreateComponentParams<RecordPanelProps, State, Refs>['render'] = ({
    refs,
    props: { recorder, onSave },
    state: { isRecording, record },
    setState,
    effect,
}) => {
    effect(() => setState({ ...defaultState }), []);

    effect(() => {
        const offs: Array<() => void> = [];

        const handleStart = () => {
            recorder?.start();

            setState({ ...defaultState });
        };

        const handleStop = () => {
            recorder?.stop();

            setState({
                isRecording: false,
                record: recorder?.getRecord() || null,
            });
        };

        refs.ButtonStart.addEventListener('click', handleStart);
        offs.push(() => refs.ButtonStart.removeEventListener('click', handleStart));

        refs.ButtonStop.addEventListener('click', handleStop);
        offs.push(() => refs.ButtonStop.removeEventListener('click', handleStop));

        return () => offs.forEach((off) => off());
    }, [recorder, refs.ButtonStart, refs.ButtonStop]);

    effect(() => {
        const offs: Array<() => void> = [];

        const handleSave = () => {
            if (record) {
                onSave(record);
            }
        };

        const handleCopy = () => {
            // eslint-disable-next-line no-console
            console.log('record to copy', record);

            if (record) {
                navigator.clipboard.writeText(JSON.stringify(record, null, 4));
            }
        };

        refs.ButtonSave.addEventListener('click', handleSave);
        offs.push(() => refs.ButtonSave.removeEventListener('click', handleSave));

        refs.ButtonCopy.addEventListener('click', handleCopy);
        offs.push(() => refs.ButtonCopy.removeEventListener('click', handleCopy));

        return () => offs.forEach((off) => off());
    }, [record, onSave, refs.ButtonSave, refs.ButtonCopy]);

    return () => {
        refs.ButtonStart.disabled = isRecording;
        refs.ButtonStop.disabled = !isRecording;
        refs.ButtonSave.disabled = record == null;
        refs.ButtonCopy.disabled = record == null;
    };
};

const recordPanel = createComponent<RecordPanelProps, State, Refs>({
    baseHTMLTemplate: template,
    createRefs: (root) => ({
        RecordPanel: root.querySelector('#RecordPanel') as HTMLDivElement,
        ButtonStart: root.querySelector('#RecordButtonStart') as HTMLButtonElement,
        ButtonStop: root.querySelector('#RecordButtonStop') as HTMLButtonElement,
        ButtonSave: root.querySelector('#RecordButtonSave') as HTMLButtonElement,
        ButtonCopy: root.querySelector('#RecordButtonCopy') as HTMLButtonElement,
    }),
    render,
});

export const renderAssistantRecordPanel = <R extends Recorder = Recorder>(recorder: R, saver: RecordSaver) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    recordPanel.mount(div, { recorder, onSave: saver.save });
};
