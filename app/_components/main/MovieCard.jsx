import Link from "next/link";
export default function MovieCard({ movie }) {
  return (
    <div className="bg-neutral-800 rounded-[12px] shadow-md flex flex-col overflow-hidden">
      <Link href={`/movies/${movie._id}`}>
        <img
          src={movie.poster}
          className="w-full object-cover h-56"
          alt={movie.title}
        />
      </Link>
      <div className="p-3 flex-1 flex flex-col">
        <Link href={`/movies/${movie._id}`}>
          <div className="font-bold text-lg mb-1">
            {movie.title}{" "}
            <span className="text-sm text-neutral-400">
              {movie.releaseDate?.slice(0, 4)}
            </span>
          </div>
        </Link>
        <div className="text-xs text-neutral-500 mb-1">
          {movie.languages.join(", ")} • {movie.quality.join(", ")}
        </div>
        <div className="text-neutral-300 text-sm line-clamp-2">
          {movie.summary}
        </div>
        <div className="mt-2 space-x-1 flex flex-wrap">
          {movie.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-pink-900 text-pink-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
