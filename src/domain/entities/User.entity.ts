import AnimeStatus from '../value-objects/animeStatus.js';
import Description from '../value-objects/description.value-object.js';
import Email from '../value-objects/email.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Password from '../value-objects/password.value-object.js';
import Url from '../value-objects/url.value-object.js';
import Anime from './Anime.entity.js';

type Role = 'user' | 'admin';

type UserProps = {
  id: Id;
  imageUrl: Url;
  username: Name;
  email: Email;
  password: Password;
  biography: Description;
  animeList: {
    list: AnimeStatus[];
    updatedAt: Date;
  };
  favoriteAnimes: {
    list: Anime[];
    updatedAt: Date;
  };
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

class User {
  private readonly _id: Id;
  private _imageUrl: Url;
  private _username: Name;
  private _email: Email;
  private _password: Password;
  private _biography: Description;
  private _animeList: {
    list: AnimeStatus[];
    updatedAt: Date;
  };
  private _favoriteAnimes: {
    list: Anime[];
    updatedAt: Date;
  };
  private readonly _role: Role;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private static readonly VALID_ROLES: Role[] = ['user', 'admin'];

  private constructor(props: UserProps) {
    this._id = props.id;
    this._imageUrl = props.imageUrl;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._biography = props.biography;
    this._animeList = props.animeList;
    this._favoriteAnimes = props.favoriteAnimes;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get biography() {
    return this._biography;
  }

  get animeList() {
    return { ...this._animeList };
  }

  get favoriteAnimes() {
    return { ...this._favoriteAnimes };
  }

  get role() {
    return this._role;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  static create(data: {
    imageUrl: string;
    username: string;
    email: string;
    password: string;
    biography: string;
    role?: Role;
  }): User {
    const normalizedRole = data.role ?? 'user';

    this.validateRole(normalizedRole);

    const id = Id.generateRandomId();
    const imageUrl = Url.create(data.imageUrl);
    const username = Name.create(data.username);
    const email = Email.create(data.email);
    const password = Password.create(data.password);
    const biography = Description.create(data.biography);
    const animeList = {
      list: [],
      updatedAt: new Date(),
    };
    const favoriteAnimes = {
      list: [],
      updatedAt: new Date(),
    };
    const role = normalizedRole;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new User({
      id,
      imageUrl,
      username,
      email,
      password,
      biography,
      animeList,
      favoriteAnimes,
      role,
      createdAt,
      updatedAt,
    });
  }

  private static validateRole(role: Role) {
    if (!this.VALID_ROLES.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
  }

  equals(other: User) {
    return this._id.equals(other._id);
  }
}

export default User;
