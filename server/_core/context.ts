import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { db } from '../db/index.js';

/**
 * Create context for tRPC
 * This is called for every request
 */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return {
    db,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
