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
	schema: ({ image }) => z.object({
		title: z.string(),
		status: z.enum(['public', 'draft', 'hidden']).default('draft'),
		thumbnailAudience: z.enum(['all', 'clients', 'academic', 'family']).default('all'),
		projectAudience: z.enum(['none', 'all', 'clients', 'academic', 'family']).default('none'),
		template: z.enum(['case-study', 'project']).optional(),
		order: z.number().default(99),
		cover: z.object({
			image: image(),
			alt: z.string().optional(),
			caption: z.string().optional(),
		}).optional(),
		meta: z.object({
			category: z.enum(['clients', 'research', 'teaching']),
			format: z.string().optional(),
			team: z.string().optional(),
			institution: z.string().optional(),
			client: z.string().optional(),
			funding: z.string().optional(),
			year: z.string().optional(),
			role: z.string().optional(),
		}),
		description: z.string().optional(),
		description_de: z.string().optional(),
		collaborators: z.string().optional(),
		curators: z.string().optional(),
		credits_image: z.string().optional(),
		credits_video: z.string().optional(),
		student: z.string().optional(),
	}),
});

export const collections = { blog, projects };
