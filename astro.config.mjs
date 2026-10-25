// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	env: {
		schema: {
			SUPABASE_URL: envField.string({ context: 'server', access: 'secret' }),
			SUPABASE_PUBLISHABLE_KEY: envField.string({ context: 'server', access: 'secret' }),
		},
	},
	fonts: [
		{
			name: 'Press Start 2P',
			cssVariable: '--font-press-start',
			provider: fontProviders.google(),
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
		{
			name: 'VT323',
			cssVariable: '--font-vt323',
			provider: fontProviders.google(),
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
