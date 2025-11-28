import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Projects Table
 * Represents a course project (one video = one project)
 */
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status', { enum: ['draft', 'processing', 'ready', 'published'] })
    .default('draft')
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Lessons Table
 * Represents individual slides/lessons within a project
 */
export const lessons = sqliteTable('lessons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  slideId: integer('slide_id').notNull(),
  timestampStart: text('timestamp_start').notNull(),
  contentSummary: text('content_summary').notNull(),
  imagePrompt: text('image_prompt').notNull(),
  imageUrl: text('image_url'),
  visualReasoning: text('visual_reasoning'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Transcripts Table
 * Stores raw transcript data for each project
 */
export const transcripts = sqliteTable('transcripts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  rawText: text('raw_text').notNull(),
  source: text('source', { enum: ['manual', 'youtube', 'gemini'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Quiz Questions Table
 * Assessment questions for each project
 */
export const quizQuestions = sqliteTable('quiz_questions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  options: text('options', { mode: 'json' }).notNull(), // JSON array of strings
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation').notNull(),
  sortOrder: integer('sort_order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});

/**
 * Course Metadata Table
 * Learning objectives, tags, and other metadata
 */
export const courseMeta = sqliteTable('course_meta', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  learningObjectives: text('learning_objectives', { mode: 'json' }).notNull(), // JSON array
  tags: text('tags', { mode: 'json' }).notNull(), // JSON array
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(unixepoch())`)
    .notNull(),
});
