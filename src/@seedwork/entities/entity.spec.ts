import UniqueEntityId from "../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "./entity";
import { validate as uuidValidate } from 'uuid';

class StubEntity extends Entity<{ prop1: string; prop2: number }> {}

describe("Entity unit tests", () => {
  it('should set props and id', () => {
    const arrange = { prop1: 'prop 1 value', prop2: 10 };
    const entity = new StubEntity(arrange);

    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBe(null);
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it('should accept a valid uuid', () => {
    const arrange = { prop1: 'prop 1 value', prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();

    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it('should convert an entity to a Javascript Object', () => {
    const arrange = { prop1: 'prop 1 value', prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();

    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.toObject()).toStrictEqual({
      id: entity.id,
      ...arrange,
    });
  });
});