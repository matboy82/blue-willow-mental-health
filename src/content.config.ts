import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    eyebrow: z.string(),
    heading: z.string(),
  }),
});
const answers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/answers' }),
  schema: z.object({
    order: z.number().int().min(1).max(12),
    title: z.string(),
    question: z.string(),
    directAnswer: z.string(),
    summary: z.string(),
  }),
});
export const collections = { pages, answers };
