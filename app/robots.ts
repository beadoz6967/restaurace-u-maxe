import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/kitchen", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
