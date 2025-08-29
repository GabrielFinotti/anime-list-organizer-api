import IUser from "../interface/user.interface";
import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import Password from "../value-object/password.vo";

class User {
  private readonly _id: string;
  private readonly _username: string;
  private _password: string;
  private _favoriteAnimes: string[];
  private _favoriteGenres: string[];

  private constructor(data: IUser) {
    this._id = ObjectId.create(data.id).value;
    this._username = Name.create(data.name).value;
    this._password = Password.create(data.password).value;
    this._favoriteAnimes = data.favoriteAnime.map(
      (anime) => ObjectId.create(anime).value
    );
    this._favoriteGenres = data.favoriteGenres.map(
      (genre) => ObjectId.create(genre).value
    );
  }

  get id() {
    return this._id;
  }
  get username() {
    return this._username;
  }
  get password() {
    return this._password;
  }
  get favoriteAnimes() {
    return [...this._favoriteAnimes];
  }
  get favoriteGenres() {
    return [...this._favoriteGenres];
  }

  set password(newPassword: string) {
    this._password = Password.create(newPassword).value;
  }
  set favoriteAnimes(newFavoriteAnimes: string[]) {
    this._favoriteAnimes = [...newFavoriteAnimes].map(
      (anime) => ObjectId.create(anime).value
    );
  }
  set favoriteGenres(newFavoriteGenres: string[]) {
    this._favoriteGenres = [...newFavoriteGenres].map(
      (genre) => ObjectId.create(genre).value
    );
  }

  static create(data: IUser): User {
    return new User(data);
  }
}

export default User;
