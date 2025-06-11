import { Link } from "@tanstack/react-router";
import React from "react";
import { FancyLink } from "./mdx";

interface UnderConstructionProps {
  description?: string;
}

export function UnderConstruction({ description }: UnderConstructionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-16 text-center font-sans">
      <div>
        <h1 className="text-4xl mt-8">🚧 Under Construction 🚧</h1>

        {description && (
          <p className="text-xl text-gray-600 max-w-xl">{description}</p>
        )}

        <p className="mt-8 max-w-md">
          I recently{" "}
          <FancyLink href="/about-site">rewrote this website</FancyLink> and
          I&apos;m working on writing up a whole bunch of content. Check back
          soon!
        </p>
      </div>
    </div>
  );
}

export default UnderConstruction;
