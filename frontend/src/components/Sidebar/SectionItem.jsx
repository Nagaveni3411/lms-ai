import { Link, useParams } from "react-router-dom";

export default function SectionItem({ section, subjectId }) {
  const { videoId } = useParams();
  return (
    <div className="mb-4">
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{section.title}</h4>
      <div className="space-y-1">
        {section.videos.map((video) => {
          const active = Number(videoId) === Number(video.id);
          return (
            <Link
              key={video.id}
              to={`/subjects/${subjectId}/video/${video.id}`}
              className={`block rounded-md border px-2 py-2 text-sm transition ${
                active
                  ? "border-[#0a4dcf] bg-blue-50 font-semibold text-[#0a4dcf]"
                  : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{video.title}</span>
              <span className="ml-2 text-xs">{video.locked ? "Locked" : video.is_completed ? "Done" : ""}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
