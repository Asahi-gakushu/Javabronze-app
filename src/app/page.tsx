import TopicGrid from "@/components/TopicGrid";
import AdSlot from "@/components/AdSlot";
import AffiliateBox from "@/components/AffiliateBox";
import { topics } from "@/data/topics";

export default function Home() {
  const totalQuestions = topics.reduce((n, t) => n + t.questions.length, 0);
  return (
    <div>
      <h1 className="text-2xl font-bold">Javaの基礎を身につけよう</h1>
      <p className="mt-2 opacity-70">
        下からトピックを選んで、短い4択クイズに挑戦しましょう。
        トピックごとの最高スコアはこの端末に保存されます。
      </p>
      <p className="mt-1 text-sm opacity-60">
        全{topics.length}トピック・{totalQuestions}問収録（毎週追加）
      </p>
      <div className="mt-8">
        <TopicGrid topics={topics} />
      </div>
      <AdSlot className="mt-10" />
      <div className="mt-10">
        <AffiliateBox />
      </div>
    </div>
  );
}
