import AddMovieForm from "@/app/_components/main/AddMovieForm";
import React from "react";

const page = () => {
  return (
    <div className="bg-neutral-900 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AddMovieForm />
      </main>
    </div>
  );
};

export default page;
