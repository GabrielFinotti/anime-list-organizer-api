import { CategoryController } from '../../presentation/http/controllers/category.controller.js';
import { GenreController } from '../../presentation/http/controllers/genre.controller.js';
import { AuthController } from '../../presentation/http/controllers/auth.controller.js';
import { AnimeController } from '../../presentation/http/controllers/anime.controller.js';
import { UserController } from '../../presentation/http/controllers/user.controller.js';

import {
  makeCreateCategoryUseCase,
  makeGetCategoryByIdUseCase,
  makeGetAllCategoriesUseCase,
  makeDeleteCategoryUseCase,
  makeCreateGenreUseCase,
  makeGetGenreByIdUseCase,
  makeGetAllGenresUseCase,
  makeDeleteGenreUseCase,
  makeLoginUseCase,
  makeLogoutUseCase,
  makeLookupAnimeUseCase,
  makeCreateAnimeUseCase,
  makeGetAnimeByIdUseCase,
  makeGetAllAnimesUseCase,
  makeUpdateAnimeUseCase,
  makeDeleteAnimeUseCase,
  makeAddMovieToAnimeUseCase,
  makeAddSeasonToAnimeUseCase,
  makeAddGenreToAnimeUseCase,
  makeRemoveMovieFromAnimeUseCase,
  makeRemoveSeasonFromAnimeUseCase,
  makeRemoveGenreFromAnimeUseCase,
  makeCreateUserUseCase,
  makeGetUserByIdUseCase,
  makeGetAllUsersUseCase,
  makeUpdateUserUseCase,
  makeDeleteUserUseCase,
  makeAddAnimeToListUseCase,
  makeRemoveAnimeFromListUseCase,
  makeToggleAnimeLikeUseCase,
  makeUpdateMovieStatusUseCase,
  makeUpdateSeasonStatusUseCase,
  makeUpdateAnimeStatusUseCase,
} from './usecases.factory.js';

/* Category */
export const makeCategoryController = (): CategoryController =>
  new CategoryController(
    makeCreateCategoryUseCase(),
    makeGetCategoryByIdUseCase(),
    makeGetAllCategoriesUseCase(),
    makeDeleteCategoryUseCase(),
  );

/* Genre */
export const makeGenreController = (): GenreController =>
  new GenreController(
    makeCreateGenreUseCase(),
    makeGetGenreByIdUseCase(),
    makeGetAllGenresUseCase(),
    makeDeleteGenreUseCase(),
  );

/* Auth */
export const makeAuthController = (): AuthController =>
  new AuthController(makeLoginUseCase(), makeLogoutUseCase());

/* Anime */
export const makeAnimeController = (): AnimeController =>
  new AnimeController(
    makeLookupAnimeUseCase(),
    makeCreateAnimeUseCase(),
    makeGetAnimeByIdUseCase(),
    makeGetAllAnimesUseCase(),
    makeUpdateAnimeUseCase(),
    makeDeleteAnimeUseCase(),
    makeAddMovieToAnimeUseCase(),
    makeAddSeasonToAnimeUseCase(),
    makeAddGenreToAnimeUseCase(),
    makeRemoveMovieFromAnimeUseCase(),
    makeRemoveSeasonFromAnimeUseCase(),
    makeRemoveGenreFromAnimeUseCase(),
  );

/* User */
export const makeUserController = (): UserController =>
  new UserController(
    makeCreateUserUseCase(),
    makeGetUserByIdUseCase(),
    makeGetAllUsersUseCase(),
    makeUpdateUserUseCase(),
    makeDeleteUserUseCase(),
    makeAddAnimeToListUseCase(),
    makeRemoveAnimeFromListUseCase(),
    makeToggleAnimeLikeUseCase(),
    makeUpdateMovieStatusUseCase(),
    makeUpdateSeasonStatusUseCase(),
    makeUpdateAnimeStatusUseCase(),
  );
