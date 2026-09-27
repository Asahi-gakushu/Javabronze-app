import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopic, topics } from "@/data/topics";
import QuizClient from "@/components/QuizClient";

export function generateStaticParams() {
  return topics.map((t) => ({ topicId: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topicId: string }>;
}): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) return {};
  const title = `${topic.title}の練習問題（${topic.questions.length}問）`;
  const description = `Java Bronze対策：${topic.description} 解説付きの無料4択クイズで理解度をチェック。`;
  return {
    title,
    description,
    alternates: { canonical: `quiz/${topic.id}/` },
    openGraph: { title, description, url: `quiz/${topic.id}/` },
  };
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
