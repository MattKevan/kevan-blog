// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import markdoc from "@astrojs/markdoc";
import embeds from 'astro-embed/integration';
import netlify from "@astrojs/netlify";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://www.kevan.tv",
  integrations: [embeds(), markdoc(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});