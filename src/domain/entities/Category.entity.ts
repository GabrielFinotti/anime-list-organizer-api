import Id from '../value-objects/id.value-object';
import Name from '../value-objects/name.value-object';

type CategoryProps = {
  _id: Id;
  name: Name;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

class Category {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = props._id;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(name: string, description: string, id?: string) {
    this.validateDescription(description);

    const newId = id ? Id.create(id) : Id.generateRandomId();
    const newName = Name.create(name);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Category({
      _id: newId,
      name: newName,
      description,
      createdAt,
      updatedAt,
    });
  }

  private static validateDescription(description: string) {
    if (typeof description !== 'string') {
      throw new Error('Description must be a string');
    }

    if (description.trim().length === 0 || description.length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }
  }
}

export default Category;
