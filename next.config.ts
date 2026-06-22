import type { NextConfig } from "next";

// Hardened HTTP security headers. Camera/mic/display-capture are allowed for
// "self" because the native meeting feature needs them.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // anti-clickjacking
  // Allow auth popups (Firebase signInWithPopup needs to read window.closed)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(self), display-capture=(self), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
