import MovieView from "@/app/_components/main/MovieView";
import connectMongoDB from "@/app/_lib/connectMongoDB";
import Movie from "@/app/models/movieModel";

export async function generateMetadata({ params }) {
  await connectMongoDB();
  const movie = await Movie.findById(params.id).lean();

  if (!movie) return { title: "Movie Not Found | Movzilla" };

  return {
    title: `${movie.title} | Movzilla`,
    description: movie.summary?.slice(0, 140),
    openGraph: {
      title: `${movie.title} - HD Download`,
      description: movie.summary,
      images: [{ url: movie.poster }],
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: movie.summary,
    },
  };
}

export default async function Page({ params }) {
  await connectMongoDB();

  const data = await Movie.findById(params.id).lean();

  if (!data) {
    return <MovieView movie={null} />;
  }

  // ✅ SANITIZE data to plain JSON
  const movie = {
    ...data,
    _id: data._id.toString(),
    releaseDate: data.releaseDate?.toISOString() || null,
    createdAt: data.createdAt?.toISOString() || null,
    updatedAt: data.updatedAt?.toISOString() || null,
    downloadLinks: data.downloadLinks?.map((dl) => ({
      label: dl.label,
      url: dl.url,
      redirectCount: dl.redirectCount,
    })),
  };

  return <MovieView movie={movie} />;
}
