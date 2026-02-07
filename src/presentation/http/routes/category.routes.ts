import { Router } from 'express';
import { makeCategoryController } from '../../../infrastructure/factories/controllers.factory.js';
import { authMiddleware, roleMiddleware } from '../middlewares/index.js';

const categoryRoutes = Router();
const categoryController = makeCategoryController();

// Rotas protegidas (user autenticado)
categoryRoutes.get('/', authMiddleware, categoryController.getAll);
categoryRoutes.get('/:id', authMiddleware, categoryController.getById);

// Rotas protegidas (admin only)
categoryRoutes.post('/', authMiddleware, roleMiddleware, categoryController.create);

categoryRoutes.delete('/:id', authMiddleware, roleMiddleware, categoryController.delete);

export default categoryRoutes;
