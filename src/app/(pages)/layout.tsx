export default function PagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full flex-1 max-w-[calc(64rem+8vw)] px-[4vw] pt-32">
        {children}
      </main>
      <footer className="mt-24 border-t border-dg">
        <div className="flex flex-wrap items-center justify-between gap-4 px-[4vw] py-8 text-sm text-accent-text">
          <span>© 2026 Martin Angell</span>
          <span className="flex gap-6">
            <a href="mailto:martin@martinangell.com" className="hover:text-fg">Email</a>
            <a href="https://github.com/martintangell" className="hover:text-fg">GitHub</a>
            <a href="/resume" target="_blank" className="hover:text-fg">Resume</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
