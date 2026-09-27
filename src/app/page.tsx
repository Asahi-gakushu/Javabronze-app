import AdSlot from "@/components/AdSlot";
import GuideCard from "@/components/GuideCard";
import PrNotice from "@/components/PrNotice";
import { getGuides } from "@/lib/guides";
import { categories, siteDescription } from "@/lib/site";

export default function Home() {
  const guides = getGuides();
  return (
    <div>
      <PrNotice />
      <h1 className="mt-6 text-2xl font-bold">在宅ワークのデスク環境、何を買えばいい？</h1>
      <p className="mt-2 leading-relaxed opacity-80">{siteDescription}</p>

      <h2 className="mt-10 text-lg font-bold">新着・更新された比較記事</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guides.slice(0, 6).map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>

      <AdSlot className="mt-10" />

      {categories.map((cat) => {
        const list = guides.filter((g) => g.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="border-l-4 border-accent pl-3 text-lg font-bold">{cat}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {list.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
