import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-obsidian p-4 text-center">
      <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>
      <h2 className="mb-8 font-mono text-xl uppercase tracking-widest text-white">
        Resource Not Found
      </h2>
      <p className="mb-12 max-w-md text-gray-400">
        The requested module or path does not exist in the current system context.
      </p>
      <Link
        href="/"
        className="border border-primary bg-transparent px-8 py-3 font-bold text-primary uppercase tracking-widest transition-colors hover:bg-primary hover:text-white"
      >
        Return to Root
      </Link>
    </div>
  )
}
