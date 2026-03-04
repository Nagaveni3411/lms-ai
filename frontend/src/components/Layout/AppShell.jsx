export default function AppShell({ sidebar, children }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-2 lg:p-0">
        {sidebar ? <aside className="hidden w-80 lg:block">{sidebar}</aside> : null}
        <main className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">{children}</main>
      </div>
    </div>
  );
}
