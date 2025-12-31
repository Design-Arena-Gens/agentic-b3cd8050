import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "ffmpeg-static"],
  webpack: (config) => {
    config.externals = config.externals ?? [];
    config.externals.push({ "@napi-rs/canvas": "commonjs @napi-rs/canvas" });
    config.externals.push({ "ffmpeg-static": "commonjs ffmpeg-static" });
    return config;
  },
};

export default nextConfig;
