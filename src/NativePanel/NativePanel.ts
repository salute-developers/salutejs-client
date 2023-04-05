import { createComponent, CreateComponentParams } from '../createComponent';
import { Suggestions, Action, TextAction } from '../typings';

import { template } from './template';
import { cl } from './utils';

export type NativePanelProps = {
    className?: string;
    bubbleText: string;
    defaultText?: string;
    suggestions: Suggestions['buttons'];
    tabIndex?: number;
    screenshotMode?: boolean;
    sendServerAction: (action: Record<string, unknown>) => void;
    sendText: (text: string) => void;
    onListen: () => void;
    onSubscribeListenStatus: (cb: (type: 'listen' | 'stopped') => void) => () => void;
    onSubscribeHypotesis: (cb: (hypotesis: string, last: boolean) => void) => () => void;
};

export type NativePanelParams = {
    hideNativePanel?: boolean;
    render?: (props: NativePanelProps) => void;
} & Pick<NativePanelProps, 'defaultText' | 'tabIndex' | 'screenshotMode'>;

type State = {
    value: string;
    recording: boolean;
    bubble: string;
    inputType: 'text-input' | 'voice-input';
};

type Refs = {
    NativePanel: HTMLDivElement;
    Bubble: HTMLDivElement;
    CarouselTouch: HTMLDivElement;
    KeyboardTouch: HTMLDivElement;
    SphereButton: HTMLDivElement;
    Suggestions: HTMLDivElement;
    TextInput: HTMLInputElement;
    VoiceTouch: HTMLDivElement;
};

const render: CreateComponentParams<NativePanelProps, State, Refs>['render'] = ({
    refs,
    props: {
        className,
        suggestions,
        screenshotMode,
        bubbleText,
        defaultText = 'Какая погода в Москве?',
        tabIndex,
        sendText,
        sendServerAction,
        onListen,
        onSubscribeListenStatus,
        onSubscribeHypotesis,
    },
    state: { inputType, bubble, recording, value },
    setState,
    effect,
}) => {
    effect(() => {
        setState({
            value: defaultText,
            recording: false,
            bubble: bubbleText,
            inputType: 'voice-input',
        });
    }, []);

    effect(() => {
        setState({ bubble: bubbleText });
    }, [bubbleText]);

    effect(() => {
        const clearBubble = () => setState({ bubble: '' });

        refs.Bubble.addEventListener('click', clearBubble);

        return () => refs.Bubble.removeEventListener('click', clearBubble);
    }, [refs.Bubble]);

    effect(() => {
        const listen = () => {
            onListen();
            setState({ value: '' });
        };

        refs.SphereButton.addEventListener('click', listen);

        return () => refs.SphereButton.removeEventListener('click', listen);
    }, [refs.SphereButton, onListen]);

    effect(() => {
        const handleSubmit = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                sendText(value);
                setState({ value: '' });
            }
        };

        const handleInput = () => {
            setState({ value: refs.TextInput.value });
        };

        refs.TextInput.addEventListener('input', handleInput);
        refs.TextInput.addEventListener('keydown', handleSubmit);

        return () => {
            refs.TextInput.removeEventListener('input', handleInput);
            refs.TextInput.removeEventListener('keydown', handleSubmit);
        };
    }, [refs.TextInput, sendText, value]);

    effect(() => {
        const toggleInputType = () => {
            setState((state) => ({
                inputType: state.inputType === 'voice-input' ? 'text-input' : 'voice-input',
            }));
        };

        refs.KeyboardTouch.addEventListener('click', toggleInputType);
        refs.VoiceTouch.addEventListener('click', toggleInputType);

        return () => {
            refs.KeyboardTouch.removeEventListener('click', toggleInputType);
            refs.VoiceTouch.removeEventListener('click', toggleInputType);
        };
    }, [refs.Bubble]);

    effect(() => {
        const offs: Array<() => void> = [];

        const handleAction = (action: Action) => {
            if (typeof action.text !== 'undefined') {
                sendText((action as TextAction).text);
            } else if (action.type === 'deep_link') {
                window.open(action.deep_link, '_blank');
            } else if (action.type === 'server_action') {
                sendServerAction(action.server_action);
            } else {
                // eslint-disable-next-line no-console
                console.error('Unsupported action', action);
            }
        };

        const createSuggestionHandler = (suggestion: Suggestions['buttons'][0]) => () => {
            const { action, actions } = suggestion;

            if (action) {
                handleAction(action);
            }

            if (actions) {
                actions.forEach(handleAction);
            }
        };

        suggestions.forEach((suggestion) => {
            const item = document.createElement('div');
            const handleClick = createSuggestionHandler(suggestion);

            item.classList.add('SuggestsSuggest');
            item.innerText = suggestion.title;

            item.addEventListener('click', handleClick);
            offs.push(() => item.removeEventListener('click', handleClick));

            refs.Suggestions.append(item);
        });

        return () => {
            offs.forEach((off) => off());

            refs.Suggestions.innerHTML = '';
        };
    }, [suggestions, sendText, sendServerAction]);

    effect(() => {
        const unsubscribeStatus = onSubscribeListenStatus((type) => {
            setState({ recording: type === 'listen' });
        });

        const unsubscribeHypotesis = onSubscribeHypotesis((hypotesis, last) => {
            setState({ value: last ? '' : hypotesis });
        });

        return () => {
            unsubscribeStatus();
            unsubscribeHypotesis();
        };
    }, [onSubscribeListenStatus, onSubscribeHypotesis]);

    return () => {
        refs.NativePanel.setAttribute(
            'class',
            cl(
                'NativePanel',
                inputType,
                !!suggestions.length && 'has-suggestions',
                screenshotMode && 'production-mode',
                className,
            ),
        );

        refs.Bubble.innerText = bubble;

        refs.SphereButton.setAttribute('class', cl('SphereButton', recording && 'active'));

        refs.TextInput.value = value;
        refs.TextInput.tabIndex = typeof tabIndex === 'number' && Number.isInteger(tabIndex) ? tabIndex : -1;
        refs.TextInput.disabled = recording;
    };
};

export const nativePanel = createComponent<NativePanelProps, State, Refs>({
    baseHTMLTemplate: template,
    createRefs: (root) => ({
        NativePanel: root.querySelector('#NativePanel') as HTMLDivElement,
        Bubble: root.querySelector('#Bubble') as HTMLDivElement,
        CarouselTouch: root.querySelector('#CarouselTouch') as HTMLDivElement,
        KeyboardTouch: root.querySelector('#KeyboardTouch') as HTMLDivElement,
        SphereButton: root.querySelector('#SphereButton') as HTMLDivElement,
        Suggestions: root.querySelector('#Suggests') as HTMLDivElement,
        TextInput: root.querySelector('#voice') as HTMLInputElement,
        VoiceTouch: root.querySelector('#VoiceTouch') as HTMLDivElement,
    }),
    render,
});
