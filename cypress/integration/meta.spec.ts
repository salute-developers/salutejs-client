/// <reference types="cypress" />

import { Message } from '../../src/proto';
import { initAssistantClient } from '../support/helpers/init';

describe('Проверяем заполнение поля meta', () => {
    it('При подключении отправляется мета', (done) => {
        const fieldName = "test_name";
        const fieldValue = { field: 1 };
        const client = initAssistantClient({ getInitialMeta: () => Promise.resolve({ [fieldName]: fieldValue }) });

		cy.mockVps((mes: Message) => {
            if (mes.initialSettings) {
                assert.isOk('Конфигурационное сообщение');
                expect(mes.meta, 'мета содержит поле из getMeta').to.have.ownProperty(fieldName);
                expect(mes.meta[fieldName], 'Значение сериализовано и совпадает с исходным').to.be.eq(JSON.stringify(fieldValue));
                
                done();
            }
        }).then(() => {
            client.start();
        });
	});
});