/// <reference types="cypress" />

describe('Тест сборок', () => {
    it('Размер бандла', () => {
        const filesSizesMap = {
            'umd/assistant.production.min.js': 12,
            'umd/assistant.development.min.js': 210,
            'cypress/fixtures/dist/createAssistant.js': 12,
            'cypress/fixtures/dist/createAssistantDevOrigin.js': 218,
        };

        Object.entries(filesSizesMap).forEach(([filePath, expectedSizeKb]) => {
            cy.readFile(filePath).then((fileContent) => {
                const currentSizeKb = Math.round(new File([fileContent], '', { type: 'text/plain' }).size / 1000);

                expect(
                    currentSizeKb <= expectedSizeKb,
                    `${filePath}: current ${currentSizeKb} KB equal or less than ${expectedSizeKb} KB`,
                ).be.true;
            });
        });
    });
});
