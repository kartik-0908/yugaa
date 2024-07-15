export { };

export type Roles = "admin" | "member";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "member";
      shopDomain?: string,
      userId?: string,
    };
  }
}