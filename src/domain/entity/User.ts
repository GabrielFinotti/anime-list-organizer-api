import About from "../values-objects/about.js";
import Email from "../values-objects/email.js";
import Id from "../values-objects/id.js";
import Name from "../values-objects/name.js";
import Password from "../values-objects/password.js";
import PhoneNumber from "../values-objects/phoneNumber.js";
import Role from "../values-objects/role.js";
import Url from "../values-objects/url.js";
import Anime from "./Anime.js";

type UserProps = {
  id: Id;
  username: Name;
  email: Email;
  password: Password;
  phoneNumber: PhoneNumber;
  imageUrl: Url;
  bio: About;
  dateOfBirth: Date;
  role: Role;
  animeList: {
    list: Anime[];
    updatedAt: Date;
  };
  favoritesAnimes: {
    list: Anime[];
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

class User {
  private readonly _id: Id;
  private _username: Name;
  private _email: Email;
  private _password: Password;
  private _phoneNumber: PhoneNumber;
  private _imageUrl: Url;
  private _bio: About;
  private readonly _dateOfBirth: Date;
  private _role: Role;
  private _animeList: {
    list: Anime[];
    updatedAt: Date;
  };
  private _favoritesAnimes: {
    list: Anime[];
    updatedAt: Date;
  };
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
    return new Date(this._dateOfBirth);
  }

  get role() {
    return this._role;
  }

  get animeList() {
    return {
      list: [...this._animeList.list],
      updatedAt: new Date(this._animeList.updatedAt),
    };
  }

  get favoritesAnimes() {
    return {
      list: [...this._favoritesAnimes.list],
      updatedAt: new Date(this._favoritesAnimes.updatedAt),
    };
  }

  get createdAt() {
    return new Date(this._createdAt);
  }

  get updatedAt() {
    return new Date(this._updatedAt);
  }

  static create(data: {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    role?: string;
  }) {
    this.validateDateOfBirth(data.dateOfBirth);

    const id = Id.generateRandom();
    const username = Name.create(data.username);
    const email = Email.create(data.email);
    const password = Password.create(data.password);
    const phoneNumber = PhoneNumber.create(data.phoneNumber);
    const imageUrl = Url.create("https://example.com/profile.png");
    const bio = About.create("This is so empty...");
    const dateOfBirth = new Date(data.dateOfBirth);
    const role = Role.create(data.role || "user");
    const animeList = {
      list: [] as Anime[],
      updatedAt: new Date(),
    };
    const favoritesAnimes = {
      list: [] as Anime[],
      updatedAt: new Date(),
    };
    const createdAt = new Date();
    const updatedAt = new Date();

    return new User({
      id,
      username,
      email,
      password,
      phoneNumber,
      imageUrl,
      bio,
      dateOfBirth,
      role,
      animeList,
      favoritesAnimes,
      createdAt,
      updatedAt,
    });
  }

  static fromPersistence(raw: {
    _id: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    imageUrl: string;
    bio: string;
    dateOfBirth: Date;
    role: string;
    animeList: {
      list: Anime[];
      updatedAt: Date;
    };
    favoritesAnimes: {
      list: Anime[];
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new User({
      id: Id.create(raw._id),
      username: Name.create(raw.username),
      email: Email.create(raw.email),
      password: Password.fromPersistence(raw.password),
      phoneNumber: PhoneNumber.create(raw.phoneNumber),
      imageUrl: Url.create(raw.imageUrl),
      bio: About.create(raw.bio),
      dateOfBirth: raw.dateOfBirth,
      role: Role.create(raw.role),
      animeList: raw.animeList,
      favoritesAnimes: raw.favoritesAnimes,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private static validateDateOfBirth(dateOfBirth: string) {
    const date = new Date(dateOfBirth);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date of birth");
    }
    if (date > now) {
      throw new Error("Date of birth cannot be in the future");
    }

    if (age < 13) {
      throw new Error("User must be at least 13 years old");
    }
  }

  updateProfile(data: { username?: string; imageUrl?: string; bio?: string }) {
    const dataToUpdate = {
      username: data.username ?? undefined,
      imageUrl: data.imageUrl ?? undefined,
      bio: data.bio ?? undefined,
    };

    if (Object.values(dataToUpdate).every((value) => value === undefined)) {
      throw new Error("No data to update");
    }

    if (data.username) {
      this._username = Name.create(data.username);
    }
    if (data.imageUrl) {
      this._imageUrl = Url.create(data.imageUrl);
    }
    if (data.bio) {
      this._bio = About.create(data.bio);
    }

    this._updatedAt = new Date();
  }

  updateAccount(data: {
    email?: string;
    password?: string;
    phoneNumber?: string;
  }) {
    const dataToUpdate = {
      email: data.email ?? undefined,
      password: data.password ?? undefined,
      phoneNumber: data.phoneNumber ?? undefined,
    };

    if (Object.values(dataToUpdate).every((value) => value === undefined)) {
      throw new Error("No data to update");
    }

    if (data.email) {
      this._email = Email.create(data.email);
    }
    if (data.password) {
      this._password = Password.create(data.password);
    }
    if (data.phoneNumber) {
      this._phoneNumber = PhoneNumber.create(data.phoneNumber);
    }

    this._updatedAt = new Date();
  }

  updateRole(role: string) {
    this._role = Role.create(role);
    this._updatedAt = new Date();
  }

  addAnimeToList(anime: Anime) {
    const existingAnimeIndex = this._animeList.list.findIndex((a) =>
      a.id.equals(anime.id),
    );

    if (existingAnimeIndex !== -1) {
      throw new Error("Anime already exists in the list");
    }

    this._animeList.list.push(anime);
    this._animeList.updatedAt = new Date();
  }

  removeAnimeFromList(anime: Anime) {
    const existingAnimeIndex = this._animeList.list.findIndex((a) =>
      a.id.equals(anime.id),
    );

    if (existingAnimeIndex === -1) {
      throw new Error("Anime not found in the list");
    }

    this._animeList.list.splice(existingAnimeIndex, 1);
    this._animeList.updatedAt = new Date();
  }

  likeAnime(anime: Anime) {
    const existingAnimeIndex = this._favoritesAnimes.list.findIndex((a) =>
      a.id.equals(anime.id),
    );

    if (existingAnimeIndex !== -1) {
      throw new Error("Anime already liked");
    }

    this._favoritesAnimes.list.push(anime);
    this._favoritesAnimes.updatedAt = new Date();
  }

  unlikeAnime(anime: Anime) {
    const existingAnimeIndex = this._favoritesAnimes.list.findIndex((a) =>
      a.id.equals(anime.id),
    );

    if (existingAnimeIndex === -1) {
      throw new Error("Anime not found in favorites");
    }

    this._favoritesAnimes.list.splice(existingAnimeIndex, 1);
    this._favoritesAnimes.updatedAt = new Date();
  }

  getPasswordFromPersistence() {
    return this._password.value;
  }

  comparePassword(password: string) {
    return this._password.comparePassword(password);
  }

  equals(other: User) {
    return this._id.equals(other._id);
  }
}

export default User;
