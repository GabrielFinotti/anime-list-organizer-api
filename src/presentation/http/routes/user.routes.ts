import { Router } from 'express';
import { makeUserController } from '../../../infrastructure/factories/controllers.factory.js';
import { authMiddleware, roleMiddleware } from '../middlewares/index.js';

const userRoutes = Router();
const userController = makeUserController();

// Rotas públicas
userRoutes.post('/', userController.create);

// Rotas protegidas (admin only)
userRoutes.get('/', authMiddleware, roleMiddleware, userController.getAll);

userRoutes.delete('/:id', authMiddleware, roleMiddleware, userController.delete);

// Rotas protegidas (user autenticado)
userRoutes.get('/:id', authMiddleware, userController.getById);

userRoutes.put('/:id', authMiddleware, userController.update);

// Anime list management (user autenticado)
userRoutes.post('/:id/anime-list', authMiddleware, userController.addAnimeToList);

userRoutes.delete('/:id/anime-list/:animeId', authMiddleware, userController.removeAnimeFromList);

userRoutes.patch('/:id/anime-list/:animeId/like', authMiddleware, userController.toggleAnimeLike);
userRoutes.patch(
  '/:id/anime-list/:animeId/status',
  authMiddleware,
  userController.updateAnimeStatus,
);
userRoutes.patch(
  '/:id/anime-list/:animeId/movie-status',
  authMiddleware,
  userController.updateMovieStatus,
);
userRoutes.patch(
  '/:id/anime-list/:animeId/season-status',
  authMiddleware,
  userController.updateSeasonStatus,
);

export default userRoutes;
