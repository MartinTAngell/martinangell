import { getPublications } from "@/lib/publications";
import Link from "next/link";

const Authors = ({ authors }: { authors: string[] }) => (
  <>
    {authors.map((name, i) => (
      <span key={name}>
        {i > 0 && ", "}
        {name.startsWith("Martin Angell") ? <b className="font-semibold text-fg">{name}</b> : name}
      </span>
    ))}
  </>
);


const Publications = () => {
  const publications = getPublications();

  return (
    <div>
      <p className="text-accent-text text-xs uppercase tracking-[0.2em]">Research</p>
      <h1 className="font-serif text-6xl leading-none mt-3">Publications</h1>
      <ol className="mt-12 divide-y divide-dg border-y border-dg">
        {publications.map((p) => (
          <li key={p.slug}>
            <Link href={`/publications/${p.slug}`} className="group grid gap-2 py-8 md:grid-cols-[4rem_1fr]">
              <span className="text-sm text-accent-text">{p.year}</span>
              <div>
                <h2 className="font-serif text-2xl leading-snug transition group-hover:text-accent">{p.title}</h2>
                <p className="mt-2 text-accent-text"><Authors authors={p.authors} /></p>
                <p className="mt-1 text-sm italic text-accent-text">
                  {p.venue}
                  {p.status && <span className="ml-3 rounded-full border border-dg px-2 py-0.5 text-xs not-italic">{p.status}</span>}
                </p>
                <p className="mt-3 text-fg/85">{p.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Publications; 
