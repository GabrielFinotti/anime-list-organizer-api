import { Router } from 'express';
import { makeGenreController } from '../../../infrastructure/factories/controllers.factory.js';
import { authMiddleware, roleMiddleware } from '../middlewares/index.js';

const genreRoutes = Router();
const genreController = makeGenreController();

// Rotas protegidas (user autenticado)
genreRoutes.get('/', authMiddleware, genreController.getAll);
genreRoutes.get('/:id', authMiddleware, genreController.getById);

// Rotas protegidas (admin only)
genreRoutes.post('/', authMiddleware, roleMiddleware, genreController.create);

genreRoutes.delete('/:id', authMiddleware, roleMiddleware, genreController.delete);

export default genreRoutes;
