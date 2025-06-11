/*
Stylistic components used by the website subpages.
*/
import { ReactNode } from "react";
import { Await, Link } from "@tanstack/react-router";

import { IMDX, IFrontMatter, AwaitIMDX } from "~/utils/mdx-fetcher";
import { motion } from "motion/react";
import { MDX } from "~/components/mdx";

export function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-5 flex flex-col justify-start min-h-[calc(100vh-64px)]">
      {children}
    </div>
  );
}

export function Description({
  frontmatter,
  to,
  index,
}: {
  frontmatter: IFrontMatter;
  to: string;
  index: number;
}) {
  return (
    <motion.section
      key={frontmatter.slug}
      initial={{ opacity: 0, translateY: 20 }}
      animate={{
        opacity: 1,
        translateY: 0,
        transition: { duration: 0.5, delay: index * 0.25 },
      }}
      exit={{ opacity: 0, translateY: 20 }}
    >
      <Link
        to={to}
        params={{
          slug: frontmatter.slug,
        }}
        resetScroll
      >
        <div
          key={frontmatter.slug}
          className="p-6 bg-dawn-pink-100 dark:bg-night-sky-950 rounded-lg shadow-md hover:underline transition-all border border-night-sky-950 dark:border-dawn-pink-100"
        >
          <div className="flex md:flex-row flex-col">
            <div className="my-auto min-w-[200px] md:max-w-[200px]">
              <h3 className="text-lg font-bold">{frontmatter.title}</h3>
              <h4 className="text-nowrap">{frontmatter.date}</h4>
            </div>
            <div className="my-5 mx-0 md:mx-5 md:my-0 flex flex-col md:flex-row justify-center">
              <div className="my-auto min-w-0.5 max-w-0.5 h-3/4 bg-night-sky-800 invisible md:visible"></div>
              <div className="min-h-0.5 max-h-0.5 w-full bg-night-sky-800  md:invisible"></div>
            </div>
            <p className="text-sm my-auto">{frontmatter.description}</p>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}

export function Intro({
  children,
  intro,
}: {
  children?: ReactNode;
  intro: { title: string; description: string };
}) {
  return (
    <div className="flex flex-col justify-start my-10">
      <h1 className="text-4xl font-bold font-serif capitalize">
        {intro.title}
      </h1>
      <h2 className="text-lg my-3">{intro.description}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Content({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto w-full">
      {children}
    </div>
  );
}

export function MDXPost({
  bundle,
  frontmatter,
  leadImage,
}: {
  bundle: Promise<IMDX>;
  frontmatter: IFrontMatter;
  leadImage?: ReactNode;
}) {
  return (
    <>
      <div className="max-w-4xl mx-auto px-5 min-h-[calc(100vh-64px)]">
        <div className="mt-10 flex flex-col justify-start">
          <h1 className="text-4xl font-serif font-bold">{frontmatter.title}</h1>
          {leadImage ? (
            <div className="flex justify-center">{leadImage}</div>
          ) : null}
          <h4 className="py-1 text-sm text-night-sky-950 dark:text-dawn-pink-100">
            {frontmatter.date === "" ? null : frontmatter.date}
          </h4>
          <p className="text-lg">{frontmatter.description}</p>
          <div className="my-5 mx-0 flex flex-row justify-center">
            <div className="min-h-0.5 max-h-0.5 w-2/3 bg-night-sky-800"></div>
          </div>
        </div>
        <Await
          promise={bundle}
          fallback={<div className="flex justify-center my-10"></div>}
        >
          {(bundle) => {
            return (
              <div className="max-w-3xl mx-auto">
                <MDX code={bundle.code} />
              </div>
            );
          }}
        </Await>
      </div>
    </>
  );
}
