import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  outputFileTracingIncludes: {
    "/api/extract-pdf": ["./node_modules/pdf-parse/**/*", "./node_modules/pdfjs-dist/**/*"],
  },
};

export default nextConfig;
