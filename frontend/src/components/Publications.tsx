import React from "react";

interface PublicationProps {
  title: string;
  date: string;
  authors: string[];
  myName: string;
  journal: string; // Added journal property
  doiLink: string; // Optional DOI link
}

interface PresentationProps {
  title: string;
  date: string;
  authors: string[];
  myName: string;
  conference: string;
  location: string;
  doiLink?: string; // Optional DOI link
}

export function Publication({
  title,
  date,
  authors,
  myName,
  journal,
  doiLink,
}: PublicationProps) {
  // Function to highlight my name in the author list
  const formatAuthors = (authors: string[], myName: string) => {
    return authors.map((author, index) => (
      <React.Fragment key={index}>
        {author === myName ? <strong>{author}</strong> : author}
        {index < authors.length - 1 && ", "}
      </React.Fragment>
    ));
  };

  return (
    <div className="px-3 py-1 rounded-lg group">
      <a
        href={doiLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:no-underline"
      >
        <div className="flex flex-col mb-2">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">
            {title}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
            {date}
          </span>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          {formatAuthors(authors, myName)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
          {journal}
        </div>
      </a>
    </div>
  );
}

export function Presentation({
  title,
  date,
  authors,
  myName,
  conference,
  location,
  doiLink,
}: PresentationProps) {
  // Function to highlight my name in the author list
  const formatAuthors = (authors: string[], myName: string) => {
    return authors.map((author, index) => (
      <React.Fragment key={index}>
        {author === myName ? <strong>{author}</strong> : author}
        {index < authors.length - 1 && ", "}
      </React.Fragment>
    ));
  };

  return (
    <div className="px-3 py-1 rounded-lg group">
      {doiLink ? (
        <a
          href={doiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:no-underline"
        >
          <div className="flex flex-col mb-2">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">
              {title}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
              {date}
            </span>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {formatAuthors(authors, myName)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
            {conference}: {location}
          </div>
        </a>
      ) : (
        <>
          <div className="flex flex-col mb-2">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
              {title}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 md:mt-0">
              {date}
            </span>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {formatAuthors(authors, myName)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
            {conference}: {location}
          </div>
        </>
      )}
    </div>
  );
}
