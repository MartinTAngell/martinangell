import { getPublication, getPublications } from "@/lib/publications";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  return getPublications().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPublication(slug);
  return p ? { title: `${p.title} | Martin Angell`, description: p.summary } : {};
}

const Publication = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const p = getPublication(slug);
  if (!p) notFound();
  return (
    <article className="max-w-3xl">
      <Link href="/publications" className="text-sm text-accent-text hover:text-fg">← All publications</Link>

      <p className="mt-10 text-accent-text text-xs uppercase tracking-[0.2em]">{p.venue}</p>
      <h1 className="font-serif text-5xl leading-tight mt-3">{p.title}</h1>
      <p className="mt-4 text-accent-text">{p.authors.join(", ")}</p>

      {p.links && (
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-accent">
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">{l.label} →</a>
          ))}
        </div>
      )}

      {p.image && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-dg bg-accent-bg">
          <Image src={p.image} alt={p.title} fill className="object-cover" sizes="(min-width: 768px) 48rem, 100vw" unoptimized={p.image.endsWith(".gif")} />
        </div>
      )}

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-accent">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.body}</ReactMarkdown>
      </div>
    </article>
  )
}

export default Publication;
