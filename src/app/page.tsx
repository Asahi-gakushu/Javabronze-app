import TopicGrid from "@/components/TopicGrid";
import { topics } from "@/data/topics";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Build your Java fundamentals</h1>
      <p className="mt-2 opacity-70">
        Pick a topic below and work through a short multiple-choice quiz.
        Your best score per topic is saved on this device.
      </p>
      <div className="mt-8">
        <TopicGrid topics={topics} />
      </div>
    </div>
  );
}
