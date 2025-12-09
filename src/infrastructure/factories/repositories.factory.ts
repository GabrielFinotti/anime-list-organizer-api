import { IAnimeRepository } from '../../domain/repositories/anime.repository.js';
import { ICategoryRepository } from '../../domain/repositories/category.repository.js';
import { IGenreRepository } from '../../domain/repositories/genre.repository.js';
import { IUserRepository } from '../../domain/repositories/user.repository.js';
import AnimeRepositoryImpl from '../repositories/anime.repository.impl.js';
import CategoryRepositoryImpl from '../repositories/category.repository.impl.js';
import GenreRepositoryImpl from '../repositories/genre.repository.impl.js';
import UserRepositoryImpl from '../repositories/user.repository.impl.js';

export const makeCategoryRepository = (): ICategoryRepository => new CategoryRepositoryImpl();

export const makeGenreRepository = (): IGenreRepository => new GenreRepositoryImpl();

export const makeAnimeRepository = (): IAnimeRepository =>
  new AnimeRepositoryImpl(makeCategoryRepository(), makeGenreRepository());

export const makeUserRepository = (): IUserRepository =>
  new UserRepositoryImpl(makeAnimeRepository());
