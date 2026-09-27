// ステルスマーケティング規制（景品表示法）対応：広告を含むページには必ず明示する。
export default function PrNotice() {
  return (
    <p className="rounded-md bg-accent-light px-3 py-2 text-xs">
      <span className="mr-1 rounded bg-accent px-1.5 py-0.5 font-bold text-white">PR</span>
      本ページはプロモーション（アフィリエイト広告）を含みます。
    </p>
  );
}
