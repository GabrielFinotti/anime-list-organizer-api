import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";

type CategoryProps = {
  id: Id;
  name: Name;
  description: string;
  targetAudience: string;
  createdAt: Date;
  updatedAt: Date;
};

class Category {
  private readonly _id: Id;
  private _name: Name;
  private _description: string;
  private _targetAudience: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._targetAudience = props.targetAudience;
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

  get targetAudience() {
    return this._targetAudience;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

export default Category;
