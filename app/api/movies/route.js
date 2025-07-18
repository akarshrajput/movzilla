import connectMongoDB from "@/app/_lib/connectMongoDB";
import APIFeatures from "@/app/_utils/apiFeatures";
import Movie from "@/app/models/movieModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const features = new APIFeatures(Movie.find().select("-__v"), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const movies = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Movies fetched successfully",
        results: movies.length,
        data: {
          movies,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching movies:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting movies",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const newMovie = await Movie.create(data);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Movie created successfully",
        data: {
          newMovie,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating movie:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Movie",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
