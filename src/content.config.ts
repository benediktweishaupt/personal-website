import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			status: z.enum(['public', 'draft', 'hidden']).default('draft'),
			audience: z.enum(['all', 'clients', 'academic', 'family']).default('all'),
			excerpt: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		status: z.enum(['public', 'draft', 'hidden']).default('draft'),
		audience: z.enum(['all', 'clients', 'academic', 'family']).default('all'),
		order: z.number().default(99),
		cover: z.object({
			image: z.string(),
			alt: z.string().optional(),
			caption: z.string().optional(),
		}),
		meta: z.object({
			category: z.enum(['clients', 'research', 'teaching']),
			format: z.string().optional(),
			team: z.string().optional(),
			institution: z.string().optional(),
			year: z.string().optional(),
		}),
		description: z.string().optional(),
	}),
});

export const collections = { blog, projects };
