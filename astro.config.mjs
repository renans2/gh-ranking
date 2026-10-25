// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	env: {
		schema: {
			SUPABASE_URL: envField.string({ context: 'server', access: 'secret' }),
			SUPABASE_PUBLISHABLE_KEY: envField.string({ context: 'server', access: 'secret' }),
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
