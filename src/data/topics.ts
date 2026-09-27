import type { Topic } from "@/types";
import basics from "./topics/basics.json";
import operators from "./topics/operators.json";
import controlFlow from "./topics/control-flow.json";
import arrays from "./topics/arrays.json";
import strings from "./topics/strings.json";
import oop from "./topics/oop.json";

// Each topic lives in its own JSON file so scripts/generate-questions.mjs can append to it.
export const topics: Topic[] = [basics, operators, controlFlow, arrays, strings, oop];

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
