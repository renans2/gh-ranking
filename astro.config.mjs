// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			SUPABASE_URL: envField.string({ context: 'server', access: 'secret' }),
			SUPABASE_PUBLISHABLE_KEY: envField.string({ context: 'server', access: 'secret' }),
		},
	},
});
