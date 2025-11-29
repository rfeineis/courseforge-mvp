/**
 * Database Schema - Dual Compatible (SQLite + MySQL)
 * 
 * This schema works with both:
 * - SQLite (development via better-sqlite3)
 * - MySQL/TiDB (production via mysql2)
 * 
 * The schema is defined using conditional table definitions based on NODE_ENV
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mysqlTable, varchar, int, text as mysqlText, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

/**
 * Helper to create table definition based on environment
 */
const createTable = isProduction ? mysqlTable : sqliteTable;

/**
 * Projects Table
 * Represents a course project (one video = one project)
 */
export const projects = isProduction
  ? mysqlTable('projects', {
      id: int('id').primaryKey().autoincrement(),
      title: varchar('title', { length: 255 }).notNull(),
      description: mysqlText('description'),
      videoUrl: varchar('video_url', { length: 512 }),
      thumbnailUrl: varchar('thumbnail_url', { length: 512 }),
      status: varchar('status', { length: 20 }).default('draft').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
      updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    })
  : sqliteTable('projects', {
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
export const lessons = isProduction
  ? mysqlTable('lessons', {
      id: int('id').primaryKey().autoincrement(),
      projectId: int('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
      slideId: int('slide_id').notNull(),
      timestampStart: varchar('timestamp_start', { length: 20 }).notNull(),
      contentSummary: mysqlText('content_summary').notNull(),
      imagePrompt: mysqlText('image_prompt').notNull(),
      imageUrl: varchar('image_url', { length: 512 }),
      visualReasoning: mysqlText('visual_reasoning'),
      sortOrder: int('sort_order').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
    })
  : sqliteTable('lessons', {
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
export const transcripts = isProduction
  ? mysqlTable('transcripts', {
      id: int('id').primaryKey().autoincrement(),
      projectId: int('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
      rawText: mysqlText('raw_text').notNull(),
      source: varchar('source', { length: 20 }).notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
    })
  : sqliteTable('transcripts', {
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
export const quizQuestions = isProduction
  ? mysqlTable('quiz_questions', {
      id: int('id').primaryKey().autoincrement(),
      projectId: int('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
      question: mysqlText('question').notNull(),
      options: mysqlText('options').notNull(), // JSON array of strings
      correctAnswer: varchar('correct_answer', { length: 10 }).notNull(),
      explanation: mysqlText('explanation').notNull(),
      sortOrder: int('sort_order').notNull(),
      createdAt: timestamp('created_at').defaultNow().notNull(),
    })
  : sqliteTable('quiz_questions', {
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
export const courseMeta = isProduction
  ? mysqlTable('course_meta', {
      id: int('id').primaryKey().autoincrement(),
      projectId: int('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
      learningObjectives: mysqlText('learning_objectives').notNull(), // JSON array
      tags: mysqlText('tags').notNull(), // JSON array
      createdAt: timestamp('created_at').defaultNow().notNull(),
    })
  : sqliteTable('course_meta', {
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
