import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-md rounded-card border border-line bg-white p-8 text-center shadow-[var(--shadow-soft)]">
        <p className="text-sm font-medium tracking-wide text-muted uppercase">
          Tourism Department
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Доступ заборонено</h1>
        <p className="mt-3 text-sm text-muted">
          Профіль іншого співробітника бачить лише він сам та адміністратор.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-[54px] w-full items-center justify-center rounded-field bg-gradient-to-br from-pine to-forest font-medium text-white transition hover:brightness-105"
        >
          На дошку поїздок
        </Link>
      </div>
    </main>
  );
}
