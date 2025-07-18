import Header from "./_components/main/Header";
import MoviesList from "./_components/main/MoviesList";

export default function Home() {
  return (
    <div className="bg-neutral-900 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <MoviesList />
      </main>
    </div>
  );
}
