import { Router } from 'express';
import { makeAnimeController } from '../../../infrastructure/factories/controllers.factory.js';
import { authMiddleware, roleMiddleware } from '../middlewares/index.js';

const animeRoutes = Router();
const animeController = makeAnimeController();

// Rotas protegidas (user autenticado)
animeRoutes.get('/', authMiddleware, animeController.getAll);
animeRoutes.get('/:id', authMiddleware, animeController.getById);

// Rotas protegidas (admin only)
animeRoutes.post('/', authMiddleware, roleMiddleware, animeController.create);

animeRoutes.put('/:id', authMiddleware, roleMiddleware, animeController.update);

animeRoutes.delete('/:id', authMiddleware, roleMiddleware, animeController.delete);

// Movies
animeRoutes.post('/:id/movies', authMiddleware, roleMiddleware, animeController.addMovie);

animeRoutes.delete('/:id/movies', authMiddleware, roleMiddleware, animeController.removeMovie);

// Seasons
animeRoutes.post('/:id/seasons', authMiddleware, roleMiddleware, animeController.addSeason);

animeRoutes.delete('/:id/seasons', authMiddleware, roleMiddleware, animeController.removeSeason);

// Genres
animeRoutes.post('/:id/genres', authMiddleware, roleMiddleware, animeController.addGenre);

animeRoutes.delete(
  '/:id/genres/:genreId',
  authMiddleware,
  roleMiddleware,
  animeController.removeGenre,
);

export default animeRoutes;
