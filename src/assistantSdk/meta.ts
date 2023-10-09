/* eslint-disable camelcase */
import { AppInfo, Meta, PermissionStatus, PermissionType, SystemMessageDataType } from '../typings';

export type Permission = Record<PermissionType, PermissionStatus>;

export type CommandResponse = Required<Pick<SystemMessageDataType, 'app_info'>> & {
    meta: {
        time: Meta['time'];
        permissions: Meta['permissions'];
        location?: Meta['location'];
    };
    server_action: {
        action_id: 'command_response';
        request_message_id: number;
        command_response: {
            request_permissions?: {
                permissions: Array<{
                    type: PermissionType;
                    status: PermissionStatus;
                }>;
            };
        };
    };
};

const convertToMetaPermissions = (permission: Permission): Meta['permissions'] =>
    Object.keys(permission).map((key: string) => ({
        type: key as PermissionType,
        status: permission[key as PermissionType],
    }));

const getLocation = async (): Promise<Meta['location']> =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            ({ coords, timestamp }) => {
                resolve({
                    lat: coords.latitude,
                    lon: coords.longitude,
                    accuracy: coords.accuracy,
                    timestamp,
                });
            },
            reject,
            { timeout: 5000 },
        );
    });

export const getTime = (): Meta['time'] => ({
    // Здесь нужен полифилл, т.к. `Intl.DateTimeFormat().resolvedOptions().timeZone` - возвращает пустую строку

    timezone_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezone_offset_sec: -new Date().getTimezoneOffset() * 60,
    timestamp: Date.now(),
});

export const getAnswerForRequestPermissions = async (
    requestMessageId: number,
    appInfo: AppInfo,
    items: PermissionType[],
): Promise<CommandResponse> => {
    const permissions: Permission = {
        record_audio: 'denied_once',
        geo: 'denied_once',
        read_contacts: 'denied_permanently',
        push: 'denied_once',
    };

    const response: CommandResponse = {
        app_info: appInfo,
        meta: {
            time: getTime(),
            permissions: [],
        },
        server_action: {
            action_id: 'command_response',
            request_message_id: requestMessageId,
            command_response: {
                request_permissions: {
                    permissions: [],
                },
            },
        },
    };

    return Promise.all(
        items.map(async (permission: PermissionType) => {
            switch (permission) {
                case 'geo':
                    try {
                        const location = await getLocation();
                        permissions.geo = 'granted';
                        response.meta.location = location;
                        response.server_action.command_response.request_permissions?.permissions.push({
                            type: 'geo',
                            status: 'granted',
                        });
                    } catch {
                        permissions.geo = 'denied_permanently';
                        response.server_action.command_response.request_permissions?.permissions.push({
                            type: 'geo',
                            status: 'denied_permanently',
                        });
                    }

                    break;
                default:
                    // остальные доступы не поддерживаем
                    response.server_action.command_response.request_permissions?.permissions.push({
                        type: permission,
                        status: 'denied_permanently',
                    });
                    break;
            }
        }),
    ).then(() => {
        response.meta.permissions = convertToMetaPermissions(permissions);
        return response;
    });
};
