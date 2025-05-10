// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import markdoc from "@astrojs/markdoc";

import cloudflare from "@astrojs/cloudflare";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://www.kevan.tv",
  integrations: [markdoc()],

  vite: {
    plugins: [tailwindcss()],
  },
  

  adapter: netlify(),
});