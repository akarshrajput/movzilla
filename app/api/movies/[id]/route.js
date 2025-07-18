import connectMongoDB from "@/app/_lib/connectMongoDB";
import Movie from "@/app/models/movieModel";
import { NextResponse } from "next/server";

// GET /api/movies/[id]
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { statusText: "error", message: "Invalid or missing movie ID." },
        { status: 400 }
      );
    }
    const movie = await Movie.findById(id);
    if (!movie) {
      return NextResponse.json(
        { statusText: "error", message: "Movie not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        statusText: "success",
        message: "Movie fetched successfully",
        data: { movie },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching movie:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting movie",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/movies/[id]
export async function PATCH(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { statusText: "error", message: "Invalid or missing movie ID." },
        { status: 400 }
      );
    }
    const updates = await request.json();
    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedMovie) {
      return NextResponse.json(
        { statusText: "error", message: "Movie not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        statusText: "success",
        message: "Movie updated successfully",
        data: { movie: updatedMovie },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating movie:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error updating movie",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/movies/[id]
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { statusText: "error", message: "Invalid or missing movie ID." },
        { status: 400 }
      );
    }
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return NextResponse.json(
        { statusText: "error", message: "Movie not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        statusText: "success",
        message: "Movie deleted successfully",
        data: { movie: deletedMovie },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting movie:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error deleting movie",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
