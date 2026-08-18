// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Titan",
      cssVariable: "--font-titan",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/titan.woff2"],
            weight: "normal",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Shippori Mincho",
      cssVariable: "--font-shippori",
    },
  ],
});
