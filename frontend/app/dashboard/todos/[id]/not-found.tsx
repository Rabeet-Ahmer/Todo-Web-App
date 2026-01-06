import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function TodoNotFound() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center bg-obsidian text-center p-4">
      <div className="mb-6 p-4 border border-primary/20 bg-primary/5">
        <AlertTriangle className="size-12 text-primary animate-pulse" />
      </div>
      <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-widest text-white">
        Objective Not Found
      </h2>
      <p className="mb-8 max-w-md text-gray-400 font-mono text-sm uppercase tracking-wider">
        The specified task ID does not exist in the current operational scope.
      </p>
      <Link
        href="/dashboard/todos"
        className="inline-flex items-center gap-2 border border-primary bg-transparent px-8 py-3 font-bold text-primary uppercase tracking-widest transition-colors hover:bg-primary hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to Queue
      </Link>
    </div>
  )
}
