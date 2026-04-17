declare module '@remix-run/node' {
  interface AppLoadContext {
    // No longer using Cloudflare context on Vercel
  }
}

export {};
