export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-obsidian">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin border-4 border-primary border-t-transparent" />
        <p className="font-mono text-sm tracking-widest text-primary uppercase animate-pulse">
          Loading System...
        </p>
      </div>
    </div>
  )
}
