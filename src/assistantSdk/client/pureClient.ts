import { VpsConfiguration } from '../../typings';
import { DEFAULT_APP } from '../const';
import { getTime } from '../meta';
import { convertFieldValuesToString } from '../utils';

import { createClient as createDummyClient } from './client';
import { MetaStringified } from './methods';
import { createProtocol } from './protocol';
import { createTransport } from './transport';

export const createClient = (configuration: VpsConfiguration) => {
    const metaProvider = async (): Promise<MetaStringified> => {
        return Promise.resolve(
            convertFieldValuesToString({
                theme: 'dark',
                time: getTime(),
                // eslint-disable-next-line camelcase
                current_app: {
                    // eslint-disable-next-line camelcase
                    app_info: DEFAULT_APP,
                },
            }),
        );
    };

    const transport = createTransport({});
    const protocol = createProtocol(transport, {
        ...configuration,
        getInitialMeta: () =>
            convertFieldValuesToString({
                default_character: 'sber',
            }),
    });

    return createDummyClient(protocol, metaProvider, {
        getVoiceMeta: () => ({} as Record<string, string>),
    });
};
