// app/search/page.js
import MoviesList from "../_components/main/MoviesList";

export default function Page({ searchParams }) {
  // searchParams is an object with all query parameters
  const { q = "" } = searchParams || {};
  return (
    <div className="bg-neutral-900 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <MoviesList query={q} />
      </main>
    </div>
  );
}
