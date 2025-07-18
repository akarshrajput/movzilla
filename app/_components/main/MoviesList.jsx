"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

const SkeletonCard = () => (
  <div className="bg-neutral-800 rounded-md animate-pulse p-4 min-h-[300px]">
    <div className="rounded bg-neutral-700 h-40 mb-2" />
    <div className="h-6 bg-neutral-700 w-2/3 mb-3 rounded" />
    <div className="h-4 bg-neutral-700 w-1/3 rounded" />
    <div className="h-5 bg-neutral-700 w-full mt-1 rounded" />
  </div>
);

const MOVIES_PER_PAGE = 8;
const BUTTONS_TO_SHOW = 8;

const MoviesList = ({ query = "" }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastKnownPage, setLastKnownPage] = useState(BUTTONS_TO_SHOW);
  console.log(query);

  // Fetch movies for the current page
  useEffect(() => {
    setLoading(true);
    setError("");

    // Build the API URL
    let apiUrl = `/api/movies?page=${page}&limit=${MOVIES_PER_PAGE}`;
    if (query && query.trim().length > 0) {
      apiUrl += `&title=${encodeURIComponent(query.trim())}`;
    }

    axios
      .get(apiUrl)
      .then((res) => {
        const data = res.data?.data?.movies || [];
        setMovies(data);
        setHasMore(data.length === MOVIES_PER_PAGE);

        if (data.length === MOVIES_PER_PAGE && page >= lastKnownPage) {
          setLastKnownPage((prev) => Math.max(prev, page + 1));
        }
      })
      .catch(() => setError("Error fetching movies"))
      .finally(() => setLoading(false));
  }, [page, lastKnownPage, query]);

  // For always 8 buttons, centered around current
  const getVisiblePages = () => {
    const pages = [];
    const middle = Math.floor(BUTTONS_TO_SHOW / 2);
    let start = Math.max(1, page - middle + 1);

    if (start + BUTTONS_TO_SHOW - 1 > lastKnownPage) {
      start = Math.max(1, lastKnownPage - BUTTONS_TO_SHOW + 1);
    }
    for (let i = 0; i < BUTTONS_TO_SHOW; i++) pages.push(start + i);
    return pages;
  };

  if (loading)
    return (
      <div className="grid md:grid-cols-4 gap-6 sm:grid-cols-2 grid-cols-1">
        {Array.from({ length: MOVIES_PER_PAGE }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  if (error) return <div className="text-red-400 p-8">{error}</div>;
  if (!movies.length)
    return <div className="text-neutral-400 p-8">No movies found.</div>;

  return (
    <div>
      {/* Movies Grid */}
      <div className="grid md:grid-cols-4 gap-6 sm:grid-cols-2 grid-cols-1">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-10 mb-6">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50 cursor-pointer"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {getVisiblePages().map((p) => (
              <PaginationItem key={p}>
                <Button
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  className={
                    (p === page
                      ? "bg-pink-700 text-white hover:bg-pink-600"
                      : "text-black") + " cursor-pointer"
                  }
                  size="icon"
                >
                  {p}
                </Button>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (hasMore) setPage((prev) => prev + 1);
                }}
                className={
                  !hasMore
                    ? "pointer-events-none opacity-50 cursor-pointer"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default MoviesList;
