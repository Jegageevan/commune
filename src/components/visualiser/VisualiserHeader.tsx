import Link from 'next/link';

export function VisualiserHeader({ code }: { code: string }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-semibold">
        Commune <span className="text-gray-500">({code})</span>
      </h1>
      <Link
        href="/"
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
      >
        Comparer cette commune
      </Link>
    </header>
  );
}

export default VisualiserHeader;
