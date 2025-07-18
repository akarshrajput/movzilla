import connectMongoDB from "../_lib/connectMongoDB";
import Movie from "../models/movieModel";

export async function GET() {
  await connectMongoDB();

  const movies = await Movie.find().select("_id updatedAt");

  const urls = movies.map((movie) => {
    return `
    <url>
      <loc>https://movzilla.site/movies/${movie._id}</loc>
      <lastmod>${movie.updatedAt.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
    </urlset>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
