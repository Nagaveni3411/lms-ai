export default function VideoProgressBar({ value }) {
  return (
    <div className="mt-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

