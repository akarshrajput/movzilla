"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed.length > 0) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      // Remove this line so input is not cleared:
      // setSearchTerm("");
    }
  };

  return (
    <header className="bg-neutral-900 border-b border-neutral-800 shadow sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Link href="/">
            <Image
              src={`/logo.png`}
              width={150}
              height={100}
              className="rounded shadow"
              quality={85}
              loading="lazy"
            />
          </Link>
          <nav className="flex items-center gap-4 ml-8">
            <Link
              href="/"
              className="text-neutral-200 hover:text-pink-300 transition text-sm"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="text-neutral-200 hover:text-pink-300 transition text-sm"
            >
              All Movies
            </Link>
          </nav>
        </div>
        {/* Search Bar */}
        <form
          className="flex items-center w-full max-w-xs sm:max-w-xs"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search movies..."
            className="px-3 py-1.5 rounded-l bg-neutral-800 border border-neutral-700 text-neutral-100 focus:outline-none focus:ring focus:border-pink-400 transition w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a movie"
          />
          <button
            type="submit"
            className="bg-pink-700 hover:bg-pink-600 px-4 py-1.5 rounded-r text-white font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
