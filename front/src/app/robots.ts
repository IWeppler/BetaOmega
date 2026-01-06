import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/dashboard", "/profile", "/training", "/zallampalam"],
      },
    ],
    sitemap: "https://betaomega.vercel.app/sitemap.xml",
  };
}
