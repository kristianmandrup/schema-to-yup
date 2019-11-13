const { buildYup } = require('../');

describe('when', () => {
    const createTester = schema => {
        return (json, expectedResult) => {
            const valid = schema.isValidSync(json);
            expect(valid).toBe(expectedResult);
        };
    };

    describe('then otherwise', () => {
        const whenThenOtherwisejson = {
            title: 'user',
            type: 'object',
            properties: {
                isBig: {
                    type: 'string'
                },
                level: {
                    type: 'number',
                    when: {
                        isBig: {
                            is: true,
                            then: {
                                min: 2
                            },
                            otherwise: {
                                min: 10
                            }
                        }
                    }
                }
            }
        };
        const $json = {
            isBig: {
                valid: {
                    isBig: 'x',
                    level: 10
                },
                invalid: {
                    isBig: 'x',
                    level: 0
                }
            },
            isNotBig: {
                valid: {
                    isBig: '',
                    level: 10
                },
                invalid: {
                    isBig: '',
                    level: 0
                }
            }
        };
        const yupSchema = buildYup(whenThenOtherwisejson);
        const tester = createTester(yupSchema);

        describe('isBig', () => {
            const json = $json.isBig;
            test('should be valid', () => {
                tester(json.valid, true);
                //Note: the min value of `then` must also be larger
                //than the min value of `otherwise`.
            });
            test('should be invalid', () => {
                tester(json.invalid, false);
            });
        });

        describe('isNotBig', () => {
            const json = $json.isNotBig;
            test('should be valid', () => {
                tester(json.valid, true);
            });

            test('should be invalid', () => {
                tester(json.invalid, false);
            });
        });
    });
});
