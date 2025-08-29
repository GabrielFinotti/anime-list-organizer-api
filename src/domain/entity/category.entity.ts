import ICategory from "../interface/category.interface";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import TargetAudience from "../value-object/targetAudience.vo";
import Traduction from "../value-object/traduction.vo";

class Category {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _traduction: string;
  private readonly _targetAudience: string;
  private readonly _characteristics: string[];

  private constructor(data: ICategory) {
    this._id = ObjectId.create(data.id).value;
    this._name = Name.create(data.name).value;
    this._traduction = Traduction.create(data.traduction).value;
    this._targetAudience = TargetAudience.create(data.targetAudience).value;
    this._characteristics = data.characteristics.map(
      (c) => Name.create(c).value
    );
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get traduction() {
    return this._traduction;
  }
  get targetAudience() {
    return this._targetAudience;
  }
  get characteristics() {
    return [...this._characteristics];
  }

  static create(data: ICategory) {
    return new Category(data);
  }
}

export default Category;
