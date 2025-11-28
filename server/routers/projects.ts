import { z } from 'zod';
import { router, publicProcedure } from '../_core/trpc.js';
import { projects } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const projectsRouter = router({
  /**
   * List all projects
   */
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(projects).orderBy(projects.updatedAt);
  }),

  /**
   * Get a single project by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  /**
   * Create a new project
   */
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        videoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(projects)
        .values({
          title: input.title,
          description: input.description,
          videoUrl: input.videoUrl,
          status: 'draft',
        })
        .returning();
      return result[0];
    }),

  /**
   * Update project
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['draft', 'processing', 'ready', 'published']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const result = await ctx.db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return result[0];
    }),

  /**
   * Delete project
   */
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});
