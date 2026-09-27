import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/guides";
import { siteUrl } from "@/lib/monetization";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getGuides();
  return [
    { url: `${siteUrl}/`, lastModified: guides[0]?.updatedAt, changeFrequency: "daily", priority: 1 },
    ...guides.map((g) => ({
      url: `${siteUrl}/guides/${g.slug}/`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/about/`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${siteUrl}/privacy/`, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
