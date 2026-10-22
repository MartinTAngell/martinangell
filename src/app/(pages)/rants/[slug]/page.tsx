import { getRants, getRant, formatDate } from "@/lib/rants";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  return getRants().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRant(slug);
  return r ? { title: `${r.title} | Martin Angell`, description: r.summary } : {};
}

function youtubeId(src: string) {
  const m = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}



const Rant = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const r = getRant(slug);
  if (!r) notFound();

  const components = {
    img: ({ src, alt, title }: { src?: string | Blob; alt?: string; title?: string }) => {
      const url = typeof src === "string" ? src : "";
      const id = youtubeId(url);
      return (
        <figure className="not-prose my-10">
          {id ? (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-dg bg-accent-bg">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={alt || "YouTube video"}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={alt ?? ""}
              loading="lazy"
              className="w-full rounded-xl border border-dg bg-accent-bg"
            />
          )}
          {title && (
            <figcaption className="mt-3 text-center text-sm italic text-accent-text">
              {title}
            </figcaption>
          )}
        </figure>
      );
    },
  };

  return (
    <article className="max-w-3xl">
      <Link href="/rants" className="text-sm text-accent-text hover:text-fg">← All rants</Link>

      <div className="mt-10 flex gap-6 text-xs uppercase tracking-[0.2em] text-accent-text">
        <p>{formatDate(r.date)}</p>
        <p>{r.length} min read</p>
      </div>
      <h1 className="mt-3 font-serif text-5xl leading-tight">{r.title}</h1>

      {r.image && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-dg bg-accent-bg">
          <Image
            src={r.image}
            alt={r.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 48rem, 100vw"
            unoptimized={r.image.endsWith(".gif")}
          />
        </div>
      )}

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-accent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...components,
            a: ({ href, children }) =>
              href?.startsWith("http") ? (
                <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
              ) : (
                <a href={href}>{children}</a>
              ),
            p: ({ children }) => <div className="my-5">{children}</div>,
          }}
        >
          {r.body}
        </ReactMarkdown>
      </div>
    </article>
  );
}

export default Rant;
