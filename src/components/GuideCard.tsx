import Link from "next/link";
import type { Guide } from "@/types";
import { formatDate } from "@/lib/guides";

export default function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}/`}
      className="block rounded-xl border border-line p-5 transition hover:border-accent hover:shadow-md"
    >
      <p className="text-xs font-semibold text-accent-dark">{guide.category}</p>
      <h3 className="mt-1 font-semibold leading-snug">{guide.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm opacity-70">{guide.description}</p>
      <p className="mt-3 text-xs opacity-50">{formatDate(guide.updatedAt)} 更新</p>
    </Link>
  );
}
