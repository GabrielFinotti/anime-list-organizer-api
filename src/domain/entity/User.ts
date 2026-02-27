import About from "../values-objects/about.js";
import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";
import Password from "../values-objects/password.js";
import PhoneNumber from "../values-objects/phoneNumber.js";
import Url from "../values-objects/url.js";

type UserProps = {
  id: Id;
  username: Name;
  email: string;
  password: Password;
  phoneNumber: PhoneNumber;
  imageUrl: Url;
  bio: About;
  dateOfBirth: Date;
  role: "user" | "admin";
  animeList: {
    list: string[];
    updatedAt: Date;
  };
  favoritesAnimes: string[];
  createdAt: Date;
  updatedAt: Date;
};

class User {
  private readonly _id: Id;
  private _username: Name;
  private _email: string;
  private _password: Password;
  private _phoneNumber: PhoneNumber;
  private _imageUrl: Url;
  private _bio: About;
  private readonly _dateOfBirth: Date;
  private _role: "user" | "admin";
  private _animeList: {
    list: string[];
    updatedAt: Date;
  };
  private _favoritesAnimes: string[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._username = props.username;
    this._email = props.email;
    this._password = props.password;
    this._phoneNumber = props.phoneNumber;
    this._imageUrl = props.imageUrl;
    this._bio = props.bio;
    this._dateOfBirth = props.dateOfBirth;
    this._role = props.role;
    this._animeList = props.animeList;
    this._favoritesAnimes = props.favoritesAnimes;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get id() {
    return this._id;
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

  get phoneNumber() {
    return this._phoneNumber;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get bio() {
    return this._bio;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  get role() {
    return this._role;
  }

  get animeList() {
    return this._animeList;
  }

  get favoritesAnimes() {
    return this._favoritesAnimes;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}

export default User;
