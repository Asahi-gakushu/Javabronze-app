import { notFound } from "next/navigation";
import { getTopic, topics } from "@/data/topics";
import QuizClient from "@/components/QuizClient";

export function generateStaticParams() {
  return topics.map((t) => ({ topicId: t.id }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) notFound();

  return <QuizClient topic={topic} />;
}
