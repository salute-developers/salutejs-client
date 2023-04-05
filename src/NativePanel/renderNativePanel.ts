import { nativePanel, NativePanelProps, NativePanelParams } from './NativePanel';

let root: HTMLDivElement | void;

export const renderNativePanel = (props: NativePanelProps & NativePanelParams) => {
    if (!root) {
        root = document.createElement('div');
        document.body.appendChild(root);
    }

    if (!props.hideNativePanel && nativePanel.mounted) {
        nativePanel.update(props);

        return;
    }

    if (props.hideNativePanel) {
        nativePanel.unmount();
        root.remove();
    } else {
        nativePanel.mount(root, props);
    }
};
