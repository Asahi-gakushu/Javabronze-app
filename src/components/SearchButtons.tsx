import { amazonSearchUrl, rakutenSearchUrl } from "@/lib/monetization";

export default function SearchButtons({ keyword }: { keyword: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={rakutenSearchUrl(keyword)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="rounded-lg bg-[#bf0000] px-4 py-2 text-sm font-bold text-white hover:opacity-85"
      >
        楽天市場で「{keyword}」を探す
      </a>
      <a
        href={amazonSearchUrl(keyword)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="rounded-lg bg-[#ff9900] px-4 py-2 text-sm font-bold text-black hover:opacity-85"
      >
        Amazonで「{keyword}」を探す
      </a>
    </div>
  );
}
