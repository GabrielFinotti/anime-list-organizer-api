import Name from "../value-object/name.vo";
import ObjectId from "../value-object/objectId.vo";
import Password from "../value-object/password.vo";

class User {
  private readonly _id: string;
  private readonly _username: string;
  private _password: string;
  private _favoriteAnimes: string[];
  private _favoriteGenres: string[];

  private constructor(
    id: string,
    username: string,
    password: string,
    favoriteAnimes: string[],
    favoriteGenres: string[]
  ) {
    this._id = ObjectId.create(id).value;
    this._username = Name.create(username).value;
    this._password = Password.create(password).value;
    this._favoriteAnimes = favoriteAnimes.map(
      (anime) => ObjectId.create(anime).value
    );
    this._favoriteGenres = favoriteGenres.map(
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

  static create(
    id: string,
    username: string,
    password: string,
    favoriteAnimes: string[],
    favoriteGenres: string[]
  ): User {
    return new User(id, username, password, favoriteAnimes, favoriteGenres);
  }
}

export default User;
