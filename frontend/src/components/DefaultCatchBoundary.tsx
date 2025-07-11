import { Link } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dawn-pink-100 dark:bg-night-sky-950 px-4 text-center">
      <h1 className="text-6xl font-bold text-night-sky-950 dark:text-dawn-pink-100">
        500
      </h1>
      <p className="mt-4 text-xl text-night-sky-950 dark:text-dawn-pink-100 max-w-md">
        Uh-oh - our ship has sprung a leak! Something went wrong on our end.
        Better head back to safety and try again later.
      </p>
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => {
            window.history.back();
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
