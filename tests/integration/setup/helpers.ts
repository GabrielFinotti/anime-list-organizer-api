import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ulid } from 'ulid';
import UserModel from '../../../src/infrastructure/database/models/user.model';
import AnimeModel from '../../../src/infrastructure/database/models/anime.model';
import CategoryModel from '../../../src/infrastructure/database/models/category.model';
import GenreModel from '../../../src/infrastructure/database/models/genre.model';
import Name from '../../../src/domain/value-objects/name.value-object';

const SECRET_KEY = 'test-secret-key';
const TOKEN_EXPIRATION = '1h';

export interface TestUser {
  id: string;
  username: string;
  email: string;
  password: string;
  hashedPassword: string;
  imageUrl: string;
  biography: string;
  role: 'user' | 'admin';
  token: string;
}

export interface TestCategory {
  id: string;
  name: string;
  description: string;
}

export interface TestGenre {
  id: string;
  name: string;
  description: string;
  isAdultContent: boolean;
}

export interface TestAnime {
  id: string;
  name: string;
  imageUrl: string;
  synopsis: string;
  category: string;
  genres: string[];
  animeType: 'serie' | 'movie' | 'mixed';
  productionType: 'original' | 'adaptation';
  movies: Array<{
    title: string;
    releaseDate: Date;
  }>;
  seasons: Array<{
    seasonNumber: number;
    releaseDate: Date;
    totalEpisodes: number;
  }>;
  isAdultContent: boolean;
}

export const generateToken = (userId: string, email: string, role: 'user' | 'admin'): string => {
  return jwt.sign({ userId, email, role }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const createTestUser = async (overrides: Partial<TestUser> = {}): Promise<TestUser> => {
  const id = overrides.id || ulid();
  const password = overrides.password || 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = overrides.role || 'user';
  const email = overrides.email || `user-${id}@test.com`;

  const userData = {
    _id: id,
    username: overrides.username || `testuser-${id}`,
    email,
    password: hashedPassword,
    imageUrl: overrides.imageUrl || 'https://example.com/avatar.jpg',
    biography: overrides.biography || 'Test user biography',
    role,
    animeList: {
      list: [],
      updatedAt: new Date(),
    },
  };

  await UserModel.create(userData);

  const token = generateToken(id, email, role);

  return {
    id,
    username: userData.username,
    email,
    password,
    hashedPassword,
    imageUrl: userData.imageUrl,
    biography: userData.biography,
    role,
    token,
  };
};

export const createTestCategory = async (
  overrides: Partial<TestCategory> = {},
): Promise<TestCategory> => {
  const id = overrides.id || ulid();

  const categoryName = overrides.name ? Name.create(overrides.name).value : Name.create(`Category ${id}`).value;

  const categoryData = {
    _id: id,
    name: categoryName,
    description: overrides.description || 'Test category description',
  };

  await CategoryModel.create(categoryData);

  return {
    id,
    name: categoryData.name,
    description: categoryData.description,
  };
};

export const createTestGenre = async (overrides: Partial<TestGenre> = {}): Promise<TestGenre> => {
  const id = overrides.id || ulid();

  const genreName = overrides.name ? Name.create(overrides.name).value : Name.create(`Genre ${id}`).value;

  const genreData = {
    _id: id,
    name: genreName,
    description: overrides.description || 'Test genre description',
    isAdultContent: overrides.isAdultContent ?? false,
  };

  await GenreModel.create(genreData);

  return {
    id,
    name: genreData.name,
    description: genreData.description,
    isAdultContent: genreData.isAdultContent,
  };
};

export const createTestAnime = async (
  categoryId: string,
  genreIds: string[] = [],
  overrides: Partial<TestAnime> = {},
): Promise<TestAnime> => {
  const id = overrides.id || ulid();

  const animeName = overrides.name ? Name.create(overrides.name).value : Name.create(`Anime ${id}`).value;

  const animeData = {
    _id: id,
    name: animeName,
    imageUrl: overrides.imageUrl || 'https://example.com/anime.jpg',
    synopsis: overrides.synopsis || 'Test anime synopsis that is long enough to be valid',
    category: categoryId,
    genres: genreIds,
    animeType: overrides.animeType || 'serie',
    productionType: overrides.productionType || 'original',
    movies: overrides.movies || [],
    seasons: overrides.seasons || [],
    isAdultContent: overrides.isAdultContent ?? false,
  };

  await AnimeModel.create(animeData);

  return {
    id,
    name: animeData.name,
    imageUrl: animeData.imageUrl,
    synopsis: animeData.synopsis,
    category: categoryId,
    genres: genreIds,
    animeType: animeData.animeType,
    productionType: animeData.productionType,
    movies: animeData.movies,
    seasons: animeData.seasons,
    isAdultContent: animeData.isAdultContent,
  };
};

export const createTestAdmin = async (overrides: Partial<TestUser> = {}): Promise<TestUser> => {
  return createTestUser({ ...overrides, role: 'admin' });
};
