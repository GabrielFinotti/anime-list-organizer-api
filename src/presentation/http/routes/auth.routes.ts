import { Router } from 'express';
import { makeAuthController } from '../../../infrastructure/factories/controllers.factory.js';
import { authMiddleware } from '../middlewares/index.js';

const authRoutes = Router();
const authController = makeAuthController();

// Rotas públicas
authRoutes.post('/login', authController.login);

// Rotas protegidas
authRoutes.post('/logout', authMiddleware, authController.logout);

export default authRoutes;
