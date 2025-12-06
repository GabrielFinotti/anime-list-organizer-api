import Description from '../value-objects/description.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';

type CategoryProps = {
  id: Id;
  name: Name;
  translatedName: Name;
  targetAudience: Name;
  description: Description;
  createdAt: Date;
  updatedAt: Date;
};

class Category {
  private readonly _id: Id;
  private readonly _name: Name;
  private readonly _translatedName: Name;
  private readonly _targetAudience: Name;
  private readonly _description: Description;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._translatedName = props.translatedName;
    this._targetAudience = props.targetAudience;
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

  get translatedName() {
    return this._translatedName;
  }

  get targetAudience() {
    return this._targetAudience;
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

  static create(name: string, translatedName: string, targetAudience: string, description: string) {
    const id = Id.generateRandomId();
    const newName = Name.create(name);
    const newTranslatedName = Name.create(translatedName);
    const newTargetAudience = Name.create(targetAudience);
    const newDescription = Description.create(description);
    const createdAt = new Date();
    const updatedAt = new Date();

    return new Category({
      id,
      name: newName,
      translatedName: newTranslatedName,
      targetAudience: newTargetAudience,
      description: newDescription,
      createdAt,
      updatedAt,
    });
  }

  static toDomain(doc: {
    id: string;
    name: string;
    translatedName: string;
    targetAudience: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Category({
      id: Id.create(doc.id),
      name: Name.create(doc.name),
      translatedName: Name.create(doc.translatedName),
      targetAudience: Name.create(doc.targetAudience),
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
