# Javabronze

Javabronzeのアプリを作る。

A small Next.js app for practicing beginner ("bronze"-level) Java fundamentals
through short multiple-choice quizzes.

## Features

- Question bank organized into 8 chapters aligned with the Oracle Java SE
  Bronze exam objectives (program flow, data declaration, operators &
  conditionals, loops, OOP concepts, class/object basics, inheritance, and
  polymorphism/packages)
- Immediate per-question feedback with explanations, in Japanese
- Score summary with a Bronze / Silver / Gold tier at the end of each quiz
- Best score per topic is saved locally in the browser (`localStorage`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project structure

- `src/data/topics.ts` — the question bank, grouped by topic
- `src/lib/progress.ts` — localStorage helpers for tracking best scores
- `src/components/TopicGrid.tsx` — home page topic cards with progress badges
- `src/components/QuizClient.tsx` — the interactive quiz flow
- `src/app/quiz/[topicId]/page.tsx` — quiz route per topic
