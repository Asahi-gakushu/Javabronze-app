import TopicGrid from "@/components/TopicGrid";
import { topics } from "@/data/topics";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Javaの基礎を身につけよう</h1>
      <p className="mt-2 opacity-70">
        下からトピックを選んで、短い4択クイズに挑戦しましょう。
        トピックごとの最高スコアはこの端末に保存されます。
      </p>
      <div className="mt-8">
        <TopicGrid topics={topics} />
      </div>
    </div>
  );
}
