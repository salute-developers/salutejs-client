export { Channel, NativePanelParams } from './createAssistantDevOrigin';

export const createAssistantDev =
    process.env.NODE_ENV === 'development' ? require('./createAssistantDevOrigin').createAssistantDev : () => null;

export const createSmartappDebugger =
    process.env.NODE_ENV === 'development' ? require('./createAssistantDevOrigin').createSmartappDebugger : () => null;
