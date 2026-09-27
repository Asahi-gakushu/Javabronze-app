import type { MetadataRoute } from "next";
import { topics } from "@/data/topics";
import { siteUrl } from "@/lib/monetization";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...topics.map((t) => ({
      url: `${siteUrl}/quiz/${t.id}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
