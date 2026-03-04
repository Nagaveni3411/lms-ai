import SectionItem from "./SectionItem";

export default function SubjectSidebar({ tree }) {
  if (!tree) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 rounded-xl bg-blue-50 p-3">
        <h3 className="text-lg font-semibold text-slate-900">{tree.title}</h3>
      </div>
      {tree.sections.map((section) => (
        <SectionItem key={section.id} section={section} subjectId={tree.id} />
      ))}
    </div>
  );
}
