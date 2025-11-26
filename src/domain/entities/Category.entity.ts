import Description from '../value-objects/description.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';

type CategoryProps = {
  id: Id;
  name: Name;
  description: Description;
  createdAt: Date;
  updatedAt: Date;
};

class Category {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _description: Description;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = props.id;
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

  static create(name: string, description: string) {
    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const newDescription = Description.create(description);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Category({
      id,
      name: newName,
      description: newDescription,
      createdAt,
      updatedAt,
    });
  }

  static toDomain(doc: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Category({
      id: Id.create(doc.id),
      name: Name.create(doc.name),
      description: Description.create(doc.description),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  equals(other: Category) {
    return this._id.equals(other.id);
  }
}

export default Category;
