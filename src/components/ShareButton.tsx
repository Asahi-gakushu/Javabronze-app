import { siteUrl } from "@/lib/monetization";

// Word of mouth is the cheapest traffic source: every finished quiz offers a one-tap share.
export default function ShareButton({ text, path }: { text: string; path: string }) {
  const params = new URLSearchParams({
    text,
    url: `${siteUrl}${path}`,
    hashtags: "Java,JavaBronze,プログラミング学習",
  });
  return (
    <a
      href={`https://x.com/intent/post?${params.toString()}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-80"
    >
      結果をXでシェア
    </a>
  );
}
