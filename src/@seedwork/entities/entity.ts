import UniqueEntityId from "../../@seedwork/domain/value-objects/unique-entity-id.vo";

export default abstract class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;
  constructor(public readonly props: Props, id?: UniqueEntityId) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id(): string {
    return this.uniqueEntityId.value;
  }

  toObject(): Required<{ id: string} & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string} & Props>;
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      ...this.props,
    });
  }
}