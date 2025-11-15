import AnimeStatus from '../value-objects/animeStatus.js';
import Email from '../value-objects/email.value-object.js';
import Id from '../value-objects/id.value-object.js';
import Name from '../value-objects/name.value-object.js';
import Password from '../value-objects/password.value-object.js';
import Anime from './Anime.entity.js';

type UserProps = {
  id: Id;
  imageUrl: string;
  username: Name;
  email: Email;
  password: Password;
  biography: string;
  animeList: {
    list: AnimeStatus[];
    updatedAt: Date;
  };
  favoriteAnimes: {
    list: Anime[];
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};
