import { router } from './trpc.js';
import { projectsRouter } from '../routers/projects.js';

/**
 * Main application router
 * Combines all feature routers
 */
export const appRouter = router({
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
