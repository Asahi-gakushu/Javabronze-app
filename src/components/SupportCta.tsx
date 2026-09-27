import { supportUrl } from "@/lib/monetization";

export default function SupportCta() {
  if (!supportUrl) return null;
  return (
    <a
      href={supportUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-lg border border-bronze px-4 py-2 text-sm font-medium text-bronze-dark transition hover:bg-bronze-light"
    >
      ☕ 問題づくりを応援する
    </a>
  );
}
