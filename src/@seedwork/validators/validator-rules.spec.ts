import ValidationError from "../errors/validator-error";
import ValidatorRules from "./validation-rules";

type Values = {
  value: any;
  property: string;
}

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrow(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrow(expected.error);
}

function runRule({ value, property, rule, params = []}: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule];
  method.apply(validator, params);
}

describe('Validator rules unit tests', () => {
  test('values method', () => {
    const validator = ValidatorRules.values('some value', 'field');
    expect(validator).toBeInstanceOf(ValidatorRules);
    expect(validator['value']).toBe('some value');
    expect(validator['property']).toBe('field');
  });

  test('required validation rule', () => {
    const invalidCases: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: '', property: 'field' }
    ];

    invalidCases.forEach(item => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error: new ValidationError('The field is required.')
      });
    })

    const validCases: Values[] = [
      { value: 'teste', property: 'field' },
      { value: 5, property: 'field' },
      { value: 0, property: 'field' },
      { value: false, property: 'field' }
    ];

    validCases.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error: new ValidationError('The field is required.')
      });
    });
  });

  test('string validation rule', () => {
    const invalidCases: Values[] = [
      { value: 5, property: 'field' },
      { value: {}, property: 'field' },
      { value: false, property: 'field' }
    ];

    invalidCases.forEach(item => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error: new ValidationError('The field must be a string.')
      });
    })

    const validCases: Values[] = [
      { value: undefined, property: 'field' },
      { value: null, property: 'field' },
      { value: 'teste', property: 'field' }
    ];

    validCases.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error: new ValidationError('The field must be a string.')
      });
    });
  });

  test('maxLength validation rule', () => {
    const invalidCases: Values[] = [
      { value: 'aaaaaa', property: 'field' },
    ];

    invalidCases.forEach(item => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error: new ValidationError('The field length must be less or equal than 5 characters.'),
        params: [5]
      });
    })

    const validCases: Values[] = [
      { value: undefined, property: 'field' },
      { value: null, property: 'field' },
      { value: 'teste', property: 'field' }
    ];

    validCases.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error: new ValidationError('The field length must be less or equal than 5 characters.'),
        params: [5]
      });
    }); 
  });

  test('boolean validation rule', () => {
    const invalidCases: Values[] = [
      { value: 5, property: 'field' },
      { value: "true", property: 'field' },
      { value: "false", property: 'field' },

    ];

    invalidCases.forEach(item => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error: new ValidationError('The field must be a boolean.'),
        params: [5]
      });
    })

    const validCases: Values[] = [
      { value: undefined, property: 'field' },
      { value: null, property: 'field' },
      { value: true, property: 'field' },
      { value: false, property: 'field' }
    ];

    validCases.forEach(item => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error: new ValidationError('The field must be a boolean.'),
        params: [5]
      });
    }); 
  });

  it('should throw a validation error when combining 2 or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field');
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError('The field is required.')
    );

    validator = ValidatorRules.values(5, 'field');
    expect(() => validator.required().string()).toThrow(
      new ValidationError('The field must be a string.')
    );

    validator = ValidatorRules.values('aaaaaa', 'field');
    expect(() => validator.required().string().maxLength(5)).toThrow(
      new ValidationError('The field length must be less or equal than 5 characters.')
    );

    validator = ValidatorRules.values(null, 'field');
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError('The field is required.')
    );

    validator = ValidatorRules.values("true", 'field');
    expect(() => validator.required().boolean()).toThrow(
      new ValidationError('The field must be a boolean.')
    );
  });

  it('should valid when combining 2 or more validation rules', () => {
    expect.assertions(0);
    ValidatorRules.values("test", 'field').required().string();
    ValidatorRules.values("aaaaa", 'field').required().string().maxLength(5);
    ValidatorRules.values(true, 'field').required().boolean();
    ValidatorRules.values(false, 'field').required().boolean();
  })
});