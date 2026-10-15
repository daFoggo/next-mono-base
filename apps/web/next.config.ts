import type { NextConfig } from "next"

// Turbopack compiles workspace packages (e.g. @workspace/ui) automatically,
// so `transpilePackages` is not needed here.
const nextConfig: NextConfig = {
  // Recommended for all new apps from Next.js 16.4 (default in create-next-app).
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
