export type IGenre = {
  id: string;
  name: string;
  characteristics: string[];
  createAt: Date;
  updateAt: Date;
};

class Genre implements IGenre {
  id: string;
  name: string;
  characteristics: string[];
  createAt: Date;
  updateAt: Date;

  constructor(props: IGenre) {
    this.id = props.id;
    this.name = props.name;
    this.characteristics = props.characteristics;
    this.createAt = props.createAt;
    this.updateAt = props.updateAt;
  }
}

export default Genre;
