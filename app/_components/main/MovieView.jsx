"use client";
import { useEffect } from "react";

const AD_LINK_1 =
  "https://somana.in/story/the-lantern-of-hollow-hill-68734b56a52538f945a2cc44";
const AD_LINK_2 =
  "https://somana.in/story/why-do-witches-ride-brooms-the-history--68254d8b0d56137884f8afec";

function getDownloadClickCount(movieId, label) {
  try {
    const key = `dl_count_${movieId}_${label}`;
    return parseInt(localStorage.getItem(key) || "0", 10);
  } catch {
    return 0;
  }
}

function setDownloadClickCount(movieId, label, count) {
  try {
    const key = `dl_count_${movieId}_${label}`;
    localStorage.setItem(key, String(count));
  } catch {}
}

export default function MovieView({ movie }) {
  if (!movie)
    return <div className="p-10 text-neutral-400">Movie not found.</div>;

  const handleDownload = (label) => (e) => {
    e.preventDefault();
    const count = getDownloadClickCount(movie._id, label) + 1;
    setDownloadClickCount(movie._id, label, count);

    if (count % 3 === 1) {
      window.open(AD_LINK_1, "_blank");
    } else if (count % 3 === 2) {
      window.open(AD_LINK_2, "_blank");
    } else {
      const link = movie.downloadLinks.find((d) => d.label === label);
      if (link?.url) {
        window.open(link.url, "_blank");
      } else {
        alert("Download link not found.");
      }
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white">
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Poster + screenshots */}
          <div>
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-48 rounded-lg shadow-lg mb-3"
                loading="lazy"
              />
            )}
            {movie.screenshots?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {movie.screenshots.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Movie Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            <div className="text-neutral-400 text-sm mb-3">
              {movie.releaseDate && (
                <>
                  <b>Release:</b> {movie.releaseDate.slice(0, 10)} &nbsp;
                </>
              )}
              <b>Duration:</b> {movie.duration}
            </div>
            <div className="text-neutral-300 text-sm mb-3">{movie.summary}</div>

            <div className="mb-2 flex flex-wrap gap-2">
              <span className="text-xs text-pink-400 font-semibold">
                {movie.genres?.join(", ")}
              </span>
              {!!movie.imdbRating && (
                <span className="inline-block bg-yellow-800 px-2 py-0.5 rounded text-yellow-200 text-xs">
                  IMDb: {movie.imdbRating}
                </span>
              )}
              <span className="text-neutral-400 text-xs ml-2">
                Views: {movie.views} &nbsp;|&nbsp; Demand: {movie.demand}
              </span>
            </div>

            <div className="mb-2">
              <b>Languages:</b> {movie.languages?.join(", ")}
            </div>
            <div className="mb-2">
              <b>Quality:</b> {movie.quality?.join(", ")}
            </div>
            <div className="mb-2">
              <b>Cast:</b> {movie.cast?.join(", ")}
            </div>

            <div className="mb-3 flex flex-wrap gap-1">
              <b>Tags:</b>
              {movie.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-pink-800 text-pink-100 px-2 py-0.5 rounded text-xs ml-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {movie.trailer && (
              <div className="mb-2">
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 underline"
                >
                  Watch Trailer
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Download Links:</h2>
          <div className="space-y-2">
            {movie.downloadLinks?.map((dl) => (
              <button
                key={dl.label}
                onClick={handleDownload(dl.label)}
                className="block w-full cursor-pointer bg-pink-700 hover:bg-pink-600 text-center font-semibold py-2 rounded text-white transition"
              >
                Download {dl.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
