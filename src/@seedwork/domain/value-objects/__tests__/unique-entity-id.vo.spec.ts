import InvalidUuidError from '../../../errors/invalid-uuid.error';
import { validate as uuidValidate } from 'uuid';
import UniqueEntityId from '../unique-entity-id.vo';

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, 'validate');
}

describe('UniqueEntityId unit tests', () => {
  it('should throw error when uuid is invalid', () => {
    const validateSpy = spyValidateMethod();
    expect(() => new UniqueEntityId('fake-id')).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a UUID passed in constructor', () => {
    const validateSpy = spyValidateMethod();

    const uuid = 'b0da610e-726a-4e1a-aa9a-a1baa8e1d876';
    const vo = new UniqueEntityId(uuid);

    expect(vo.value).toBe(uuid);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should accept a UUID passed in constructor', () => {
    const validateSpy = spyValidateMethod();

    const vo = new UniqueEntityId();

    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalled();
  });
});