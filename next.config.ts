import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  agentRules: false,
  cacheComponents: true,
  // 개발 모드에서만 React 컴포넌트 트리·렌더 시간을 Chrome DevTools MCP에 노출한다(docs/MCP.md). 프로덕션 번들에는 들어가지 않는다.
  instrumentationClientInject: process.env.NODE_ENV === "development" ? ["react-devtools-cdt-mcp/register"] : [],
  partialPrefetching: true,
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
