import { formatDate, getRants } from "@/lib/rants"
import Link from "next/link";

const Rants = () => {
  const rants = getRants();

  return (
    <div>
      <h1 className="font-serif text-6xl leading-none mt-3">Rants</h1>
      <p className="italic font-serif text-lg text-accent-text">Opinions about literally anything that isn&apos;t computer science. If you need opinions about computing, ask someone smarter.</p>
      <ol className="mt-12 divide-y divide-dg border-y border-dg">
        {rants.map((r) => (
          <li key={r.slug}>
            <Link href={`/rants/${r.slug}`} className="group grid gap-2 py-8 md:grid-cols-[8rem_1fr] md:gap-8">
              <div className="flex gap-4 text-sm text-accent-text uppercase md:flex-col md:gap-1">
                <p>{formatDate(r.date)}</p>
                <p>{r.length} min read</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl leading-snug transition group-hover:text-accent">{r.title}</h2>
                <p className="mt-3 text-fg/85">{r.summary}</p>
              </div>

            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Rants;
