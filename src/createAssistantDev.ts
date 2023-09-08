import type {
    createAssistantDev as createAssistantDevOrigin,
    createSmartappDebugger as createSmartappDebuggerOrigin,
} from './createAssistantDevOrigin';

export { Channel, NativePanelParams } from './createAssistantDevOrigin';

export const createAssistantDev: typeof createAssistantDevOrigin =
    process.env.NODE_ENV === 'development' ? require('./createAssistantDevOrigin').createAssistantDev : () => null;

export const createSmartappDebugger: typeof createSmartappDebuggerOrigin =
    process.env.NODE_ENV === 'development' ? require('./createAssistantDevOrigin').createSmartappDebugger : () => null;
