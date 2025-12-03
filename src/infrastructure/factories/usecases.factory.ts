import {
  CreateAnimeUseCase,
  GetAnimeByIdUseCase,
  GetAllAnimesUseCase,
  UpdateAnimeUseCase,
  DeleteAnimeUseCase,
  AddMovieToAnimeUseCase,
  AddSeasonToAnimeUseCase,
  AddGenreToAnimeUseCase,
  RemoveMovieFromAnimeUseCase,
  RemoveSeasonFromAnimeUseCase,
  RemoveGenreFromAnimeUseCase,
} from '../../application/use-cases/anime/index.js';

import { LoginUseCase, LogoutUseCase } from '../../application/use-cases/auth/index.js';

import {
  CreateCategoryUseCase,
  GetCategoryByIdUseCase,
  GetAllCategoriesUseCase,
  DeleteCategoryUseCase,
} from '../../application/use-cases/category/index.js';

import {
  CreateGenreUseCase,
  GetGenreByIdUseCase,
  GetAllGenresUseCase,
  DeleteGenreUseCase,
} from '../../application/use-cases/genre/index.js';

import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  GetAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  AddAnimeToListUseCase,
  RemoveAnimeFromListUseCase,
  ToggleAnimeLikeUseCase,
  UpdateMovieStatusUseCase,
  UpdateSeasonStatusUseCase,
  UpdateAnimeStatusUseCase,
} from '../../application/use-cases/user/index.js';

import {
  makeAnimeRepository,
  makeCategoryRepository,
  makeGenreRepository,
  makeUserRepository,
} from './repositories.factory.js';

import { makeJwtService, makeTokenBlacklistService } from './services.factory.js';

/* Anime */
export const makeCreateAnimeUseCase = (): CreateAnimeUseCase =>
  new CreateAnimeUseCase(makeAnimeRepository(), makeCategoryRepository(), makeGenreRepository());

export const makeGetAnimeByIdUseCase = (): GetAnimeByIdUseCase =>
  new GetAnimeByIdUseCase(makeAnimeRepository());

export const makeGetAllAnimesUseCase = (): GetAllAnimesUseCase =>
  new GetAllAnimesUseCase(makeAnimeRepository());

export const makeUpdateAnimeUseCase = (): UpdateAnimeUseCase =>
  new UpdateAnimeUseCase(makeAnimeRepository(), makeCategoryRepository());

export const makeDeleteAnimeUseCase = (): DeleteAnimeUseCase =>
  new DeleteAnimeUseCase(makeAnimeRepository());

export const makeAddMovieToAnimeUseCase = (): AddMovieToAnimeUseCase =>
  new AddMovieToAnimeUseCase(makeAnimeRepository());

export const makeAddSeasonToAnimeUseCase = (): AddSeasonToAnimeUseCase =>
  new AddSeasonToAnimeUseCase(makeAnimeRepository());

export const makeAddGenreToAnimeUseCase = (): AddGenreToAnimeUseCase =>
  new AddGenreToAnimeUseCase(makeAnimeRepository(), makeGenreRepository());

export const makeRemoveMovieFromAnimeUseCase = (): RemoveMovieFromAnimeUseCase =>
  new RemoveMovieFromAnimeUseCase(makeAnimeRepository());

export const makeRemoveSeasonFromAnimeUseCase = (): RemoveSeasonFromAnimeUseCase =>
  new RemoveSeasonFromAnimeUseCase(makeAnimeRepository());

export const makeRemoveGenreFromAnimeUseCase = (): RemoveGenreFromAnimeUseCase =>
  new RemoveGenreFromAnimeUseCase(makeAnimeRepository());

/* Auth */
export const makeLoginUseCase = (): LoginUseCase =>
  new LoginUseCase(makeUserRepository(), makeJwtService());

export const makeLogoutUseCase = (): LogoutUseCase =>
  new LogoutUseCase(makeJwtService(), makeTokenBlacklistService());

/* Category */
export const makeCreateCategoryUseCase = (): CreateCategoryUseCase =>
  new CreateCategoryUseCase(makeCategoryRepository());

export const makeGetCategoryByIdUseCase = (): GetCategoryByIdUseCase =>
  new GetCategoryByIdUseCase(makeCategoryRepository());

export const makeGetAllCategoriesUseCase = (): GetAllCategoriesUseCase =>
  new GetAllCategoriesUseCase(makeCategoryRepository());

export const makeDeleteCategoryUseCase = (): DeleteCategoryUseCase =>
  new DeleteCategoryUseCase(makeCategoryRepository());

/* Genre */
export const makeCreateGenreUseCase = (): CreateGenreUseCase =>
  new CreateGenreUseCase(makeGenreRepository());

export const makeGetGenreByIdUseCase = (): GetGenreByIdUseCase =>
  new GetGenreByIdUseCase(makeGenreRepository());

export const makeGetAllGenresUseCase = (): GetAllGenresUseCase =>
  new GetAllGenresUseCase(makeGenreRepository());

export const makeDeleteGenreUseCase = (): DeleteGenreUseCase =>
  new DeleteGenreUseCase(makeGenreRepository());

/* User */
export const makeCreateUserUseCase = (): CreateUserUseCase =>
  new CreateUserUseCase(makeUserRepository());

export const makeGetUserByIdUseCase = (): GetUserByIdUseCase =>
  new GetUserByIdUseCase(makeUserRepository());

export const makeGetAllUsersUseCase = (): GetAllUsersUseCase =>
  new GetAllUsersUseCase(makeUserRepository());

export const makeUpdateUserUseCase = (): UpdateUserUseCase =>
  new UpdateUserUseCase(makeUserRepository());

export const makeDeleteUserUseCase = (): DeleteUserUseCase =>
  new DeleteUserUseCase(makeUserRepository());

export const makeAddAnimeToListUseCase = (): AddAnimeToListUseCase =>
  new AddAnimeToListUseCase(makeUserRepository(), makeAnimeRepository());

export const makeRemoveAnimeFromListUseCase = (): RemoveAnimeFromListUseCase =>
  new RemoveAnimeFromListUseCase(makeUserRepository(), makeAnimeRepository());

export const makeToggleAnimeLikeUseCase = (): ToggleAnimeLikeUseCase =>
  new ToggleAnimeLikeUseCase(makeUserRepository(), makeAnimeRepository());

export const makeUpdateMovieStatusUseCase = (): UpdateMovieStatusUseCase =>
  new UpdateMovieStatusUseCase(makeUserRepository(), makeAnimeRepository());

export const makeUpdateSeasonStatusUseCase = (): UpdateSeasonStatusUseCase =>
  new UpdateSeasonStatusUseCase(makeUserRepository(), makeAnimeRepository());

export const makeUpdateAnimeStatusUseCase = (): UpdateAnimeStatusUseCase =>
  new UpdateAnimeStatusUseCase(makeUserRepository(), makeAnimeRepository());
