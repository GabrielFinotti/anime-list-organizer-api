export type ICategory = {
  id: string;
  name: string;
  traduction: string;
  targetAudience: string;
  characteristics: string[];
  createAt: Date;
  updateAt: Date;
};

class Category implements ICategory {
  id: string;
  name: string;
  traduction: string;
  targetAudience: string;
  characteristics: string[];
  createAt: Date;
  updateAt: Date;

  constructor(props: ICategory) {
    this.id = props.id;
    this.name = props.name;
    this.traduction = props.traduction;
    this.targetAudience = props.targetAudience;
    this.characteristics = props.characteristics;
    this.createAt = props.createAt;
    this.updateAt = props.updateAt;
  }
}

export default Category;
