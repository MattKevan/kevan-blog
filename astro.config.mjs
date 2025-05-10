// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://www.kevan.tv",
  integrations: [preact(), react(), markdoc()],

  vite: {
    plugins: [tailwindcss()],
  },
  

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});