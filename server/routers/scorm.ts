import { z } from 'zod';
import { router, publicProcedure } from '../_core/trpc.js';
import { projects, lessons, quizQuestions, courseMeta } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import {
  SCORMVersion,
  SCORMConfig,
  SCORMPackageGenerator,
  SuspendDataManager,
} from '../services/scorm.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scormRouter = router({
  /**
   * Generate SCORM package for a project
   */
  generatePackage: publicProcedure
    .input(
      z.object({
        projectId: z.number(),
        version: z.enum(['1.2', '2004']).default('1.2'),
        passingScore: z.number().min(0).max(100).default(70),
        masteryScore: z.number().min(0).max(100).default(80),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch project data
      const project = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.projectId))
        .limit(1);

      if (!project[0]) {
        throw new Error('Project not found');
      }

      // Fetch lessons
      const projectLessons = await ctx.db
        .select()
        .from(lessons)
        .where(eq(lessons.projectId, input.projectId))
        .orderBy(lessons.sortOrder);

      // Fetch quiz questions
      const quiz = await ctx.db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.projectId, input.projectId))
        .orderBy(quizQuestions.sortOrder);

      // Fetch course metadata
      const meta = await ctx.db
        .select()
        .from(courseMeta)
        .where(eq(courseMeta.projectId, input.projectId))
        .limit(1);

      // Prepare course data for player
      const courseData = {
        title: project[0].title,
        description: project[0].description,
        lessons: projectLessons.map((lesson) => ({
          id: lesson.id,
          slideId: lesson.slideId,
          timestampStart: lesson.timestampStart,
          contentSummary: lesson.contentSummary,
          imageUrl: lesson.imageUrl,
          visualReasoning: lesson.visualReasoning,
        })),
        quiz: quiz.map((q) => ({
          question: q.question,
          options: q.options as string[],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })),
        meta: meta[0]
          ? {
              learningObjectives: meta[0].learningObjectives as string[],
              tags: meta[0].tags as string[],
            }
          : null,
      };

      // Validate suspend data size (simulate worst case)
      const testSuspendData = {
        l: projectLessons.length - 1,
        t: Math.floor(Date.now() / 1000),
        q: quiz.reduce((acc, q, idx) => {
          acc[`q${idx}`] = 'D'; // Worst case: all answers
          return acc;
        }, {} as Record<string, string>),
      };

      if (!SuspendDataManager.validate(testSuspendData)) {
        throw new Error(
          `Suspend data exceeds SCORM 1.2 limit. Current size: ${SuspendDataManager.getSize(
            testSuspendData
          )} characters. Consider reducing quiz questions.`
        );
      }

      // Load HTML template
      const templatePath = path.join(
        __dirname,
        '../services/scorm-player-template.html'
      );
      let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

      // Replace placeholders
      htmlTemplate = htmlTemplate
        .replace(/\{\{COURSE_TITLE\}\}/g, project[0].title)
        .replace(/\{\{COURSE_DATA\}\}/g, JSON.stringify(courseData))
        .replace(/\{\{PASSING_SCORE\}\}/g, input.passingScore.toString())
        .replace(/\{\{HAS_QUIZ\}\}/g, quiz.length > 0 ? 'true' : 'false');

      // Create SCORM config
      const scormConfig: SCORMConfig = {
        version:
          input.version === '1.2' ? SCORMVersion.SCORM_1_2 : SCORMVersion.SCORM_2004,
        courseTitle: project[0].title,
        courseDescription: project[0].description || '',
        passingScore: input.passingScore,
        masteryScore: input.masteryScore,
      };

      // Generate package
      const outputDir = path.join(process.cwd(), 'exports');
      await fs.mkdir(outputDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `${project[0].title.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.zip`;
      const outputPath = path.join(outputDir, filename);

      await SCORMPackageGenerator.createPackage(
        scormConfig,
        htmlTemplate,
        outputPath
      );

      // Update project status
      await ctx.db
        .update(projects)
        .set({ status: 'published', updatedAt: new Date() })
        .where(eq(projects.id, input.projectId));

      return {
        success: true,
        filename,
        path: outputPath,
        suspendDataSize: SuspendDataManager.getSize(testSuspendData),
        suspendDataLimit: 4096,
      };
    }),

  /**
   * Validate suspend data size for a project
   */
  validateSuspendData: publicProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      // Fetch lessons count
      const projectLessons = await ctx.db
        .select()
        .from(lessons)
        .where(eq(lessons.projectId, input.projectId));

      // Fetch quiz questions count
      const quiz = await ctx.db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.projectId, input.projectId));

      // Simulate worst-case suspend data
      const testSuspendData = {
        l: projectLessons.length - 1,
        t: Math.floor(Date.now() / 1000),
        q: quiz.reduce((acc, q, idx) => {
          acc[`q${idx}`] = 'D';
          return acc;
        }, {} as Record<string, string>),
      };

      const size = SuspendDataManager.getSize(testSuspendData);
      const isValid = SuspendDataManager.validate(testSuspendData);

      return {
        size,
        limit: 4096,
        isValid,
        utilizationPercentage: Math.round((size / 4096) * 100),
        lessonsCount: projectLessons.length,
        quizQuestionsCount: quiz.length,
      };
    }),
});
