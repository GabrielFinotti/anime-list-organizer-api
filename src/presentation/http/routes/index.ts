import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import genreRoutes from './genre.routes.js';
import animeRoutes from './anime.routes.js';
import userRoutes from './user.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/genres', genreRoutes);
router.use('/animes', animeRoutes);
router.use('/users', userRoutes);

export default router;
