import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SAKO — Future-Forward Digital Agency",
    short_name: "SAKO",
    description: "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
