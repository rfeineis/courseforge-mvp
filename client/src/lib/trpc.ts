import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/_core/app';

/**
 * Create tRPC React hooks
 * Type-safe client for the backend API
 */
export const trpc = createTRPCReact<AppRouter>();
