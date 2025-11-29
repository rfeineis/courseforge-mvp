import { router } from './trpc.js';
import { projectsRouter } from '../routers/projects.js';
import { scormRouter } from '../routers/scorm.js';

/**
 * Main application router
 * Combines all feature routers
 */
export const appRouter = router({
  projects: projectsRouter,
  scorm: scormRouter,
});

export type AppRouter = typeof appRouter;
