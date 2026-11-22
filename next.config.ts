import type { NextConfig } from "next";

// `npm run build:static` makes a plain static site in out/ for Cloudflare Pages.
// A static export refuses Cache Components and the image optimizer, so they are off only then.
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic
    ? { output: "export", images: { unoptimized: true } }
    : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
