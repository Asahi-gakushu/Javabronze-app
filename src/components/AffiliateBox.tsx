import { amazonSearchUrl, amazonTag, recommendedBooks } from "@/lib/monetization";

export default function AffiliateBox({ heading = "合格に近づくおすすめ教材" }: { heading?: string }) {
  return (
    <section className="rounded-xl border border-bronze-light p-5 text-left">
      <h2 className="font-semibold">{heading}</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {recommendedBooks.map((book) => (
          <li key={book.title}>
            <a
              href={amazonSearchUrl(book.keywords)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block rounded-lg bg-bronze-light/40 p-3 transition hover:bg-bronze-light"
            >
              <span className="font-medium text-bronze-dark">{book.title} →</span>
              <span className="mt-0.5 block text-sm opacity-70">{book.note}</span>
            </a>
          </li>
        ))}
      </ul>
      {amazonTag && (
        <p className="mt-3 text-xs opacity-50">
          ※ Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
        </p>
      )}
    </section>
  );
}
