// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  // All of these routes require the user to be authenticated
  matcher: [
    "/",
    "/kyc/:path*",
    "/modules/:path*",
    "/api/kyc/:path*",
    "/api/generate/:path*",
  ],
};
