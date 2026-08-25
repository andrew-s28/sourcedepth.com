import { createFileRoute, Link } from "@tanstack/react-router";
import hexToRgba from "hex-to-rgba";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ReactNode, useEffect, useRef } from "react";
import { useIsSSR } from "~/hooks/useIsSSR";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { useHeight, useWidth } from "~/hooks/useWindowSize";
import { fetchMDX, IFrontMatter } from "~/utils/mdx-fetcher";

export const Route = createFileRoute("/")({
  loader: () => fetchMDX({ data: { directory: "posts" } }),
  component: Home,
});

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function zip(...arrays: (string[] | number[])[]): (string | number)[][] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  return Array.from({ length: maxLength }, (_, i) => {
    return arrays.map((arr) => arr[i]);
  });
}

function HeroCard() {
  return (
    <div className="flex flex-col h-full align-middle justify-center m-2 -translate-y-2">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{
          opacity: 1,
          translateY: 0,
          transition: { duration: 0.8, delay: 1 },
        }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col justify-center align-middle max-w-2xl mx-auto">
          <Link
            to="/about"
            className="border-2 bg-dawn-pink-100 dark:bg-night-sky-950 border-night-sky-950 dark:border-dawn-pink-100 rounded-3xl px-5 py-2 w-fit mx-auto group"
            resetScroll
          >
            <div className="rounded-3xl px-5 py-2">
              <h1 className="text-4xl text-center font-serif">
                Andrew Scherer
              </h1>
              <h2 className="mt-1 text-center text-xl">
                Physical Oceanographer <br /> Software Developer
              </h2>
              <div className="mt-2">
                <SeeMoreButton label="More About Me" />
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function SeeMoreButton({ label = "See More" }: { label?: string }) {
  return (
    <div className="flex justify-center">
      <div className="relative rounded align-middle justify-center px-4 items-center space-x-2">
        <div className="group flex items-center justify-center -translate-x-2">
          <span
            title={label}
            className="text-xl underline decoration-transparent transition-[text-decoration-color] duration-500 flex justify-center group-hover:decoration-night-sky-950 dark:group-hover:decoration-dawn-pink-100"
          >
            {label}
          </span>
          <div className="relative ms-1">
            <ArrowRight
              className="absolute my-auto top-1/2 transform -translate-y-1/2 transition-transform duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
            <ChevronRight
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:translate-x-3 transition-all duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
            <ChevronRight
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:translate-x-5 transition-all duration-1000 ease-in-out animate-out"
              size={20}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StarfieldConfig {
  n: number;
  size: number;
  color: string;
  top: { min: number; max: number };
  left: { min: number; max: number };
  duration: { min: number; max: number };
  shadow?: { color: string; size: string };
  animate?: boolean;
}

function Starfield({ configs }: { configs: StarfieldConfig[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { width: widthInit } = useWidth();
  const { height: heightInit } = useHeight();
  const width = widthInit || 10000; // Fallback to 10000 if width is not available
  const height = heightInit || 400; // Fallback to 400 if height is not available
  const prefersReducedMotion = usePrefersReducedMotion();

  const milkyWayColors = [
    "#280F36",
    "#632B6C",
    "#BE6590",
    "#FFC1A0",
    "#FE9C7F",
  ];

  const scaleFactor = width / 1920;

  // Scale the number of stars (n) in each config based on the screen width
  const scaledConfigs = configs.map((config) => ({
    ...config,
    n: Math.round(config.n * scaleFactor),
  }));

  // Disable animation for all configs if prefersReducedMotion is true
  if (prefersReducedMotion) {
    scaledConfigs.forEach((config) => {
      config.animate = false;
    });
  }

  // Pre-compute all star data
  const allStarData = scaledConfigs.flatMap((config, configIndex) => {
    const tops = Array.from({ length: config.n }, () =>
      getRandom(config.top.min, config.top.max)
    );
    const lefts = Array.from({ length: config.n }, () =>
      getRandom(config.left.min, config.left.max)
    );
    const durations = Array.from({ length: config.n }, () =>
      getRandom(config.duration.min, config.duration.max)
    );
    const randomColors = Array.from(
      { length: config.n },
      () => milkyWayColors[Math.floor(getRandom(0, milkyWayColors.length))]
    );

    // Return an array of individual star configs
    return Array.from({ length: config.n }, (_, i) => ({
      top: tops[i],
      left: lefts[i],
      size: config.size,
      color: config.color,
      duration: durations[i],
      randomColor: randomColors[i],
      shadow: config.shadow,
      animate: config.animate ?? true,
      configIndex,
    }));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = 400;

    let animationFrameId: number;
    const startTime = performance.now();

    // Animation function that runs every frame
    const animate = () => {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000; // convert to seconds

      ctx.clearRect(0, 0, width, height);

      // Draw all stars
      for (const star of allStarData) {
        if (!star.animate) {
          // Static opacity for non-animated stars
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            (star.left / 100) * width,
            (star.top / 100) * canvas.height,
            star.size,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            star.color === "random" ? star.randomColor : star.color;

          if (star.shadow) {
            ctx.shadowColor =
              star.shadow.color === "random"
                ? star.randomColor
                : star.shadow.color;
            ctx.shadowBlur = star.size * 2;
          }

          ctx.fill();
          ctx.closePath();
          ctx.restore();
        } else {
          // Animated stars with individual opacity cycles
          const individualOpacity =
            (Math.sin(elapsedTime * ((2 * Math.PI) / star.duration)) + 1) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(
            (star.left / 100) * width,
            (star.top / 100) * canvas.height,
            star.size,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            star.color === "random"
              ? hexToRgba(star.randomColor, individualOpacity)
              : hexToRgba(star.color, individualOpacity);

          if (star.shadow) {
            ctx.shadowColor =
              star.shadow.color === "random"
                ? star.randomColor
                : star.shadow.color;
            ctx.shadowBlur = star.size * 2;
          }

          ctx.fill();
          ctx.closePath();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      // Cleanup function to cancel the animation
      cancelAnimationFrame(animationFrameId);
    };
  }, [allStarData, width]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0"
      aria-label="A backdrop of the night sky with twinkling stars"
    ></canvas>
  );
}

function IntroCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const child = {
    hidden: {
      opacity: 0,
      translateY: 20,
    },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: {
        ease: "easeInOut" as const,
        duration: 0.8,
      },
    },
  };
  return (
    <div className=" bg-ocean-700 justify-center px-5 pb-20">
      <motion.div variants={child} viewport={{ once: true }}>
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          whileInView={{
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.8 },
          }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="flex flex-col justify-center align-middle max-w-2xl mx-auto">
            <div className="flex flex-col p-4 bg-dawn-pink-100 dark:bg-night-sky-950 rounded-lg shadow-md border border-night-sky-950 dark:border-dawn-pink-100">
              <h2 className="text-2xl font-serif me-1 font-bold mb-2 px-4">
                {title}
              </h2>
              {children}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function BlogsIntro() {
  const { frontmatters } = Route.useLoaderData();
  frontmatters.sort((a: IFrontMatter, b: IFrontMatter) => {
    return b.date.localeCompare(a.date);
  });
  const SHOW_N_POSTS = 3;
  return (
    <IntroCard title="Recent Blog Posts">
      <div className="grid grid-cols-1 gap-4">
        {frontmatters.slice(0, SHOW_N_POSTS).map((fm: IFrontMatter) => (
          <div key={fm.slug}>
            <Link
              to={`/blog/posts/$slug`}
              params={{ slug: fm.slug }}
              resetScroll
            >
              <div className="flex flex-col p-4 rounded-lg group">
                <div className="flex space-x-2 mb-2">
                  <h3 className="text-lg font-bold underline decoration-transparent group-hover:decoration-inherit transition-[text-decoration-color] duration-500 m-0">
                    {fm.title}
                  </h3>
                  <div className="relative -translate-x-2 dark:text-dawn-pink-100 text-night-sky-950">
                    <ChevronRight
                      className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-2 transition-[translate,opacity] duration-1000 ease-in-out"
                      size={20}
                      aria-hidden="true"
                    />
                    <ChevronRight
                      className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-4 transition-[translate,opacity] duration-1000 ease-in-out"
                      size={20}
                      aria-hidden="true"
                    />
                    <ChevronRight
                      className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-6 transition-[translate,opacity] duration-1000 ease-in-out"
                      size={20}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <p className="text-sm mb-auto">{fm.description}</p>
              </div>
            </Link>
            <div className="flex justify-center mx-auto my-1 bg-night-sky-950 dark:bg-dawn-pink-100 h-0.5 w-2/3" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <Link
          to="/blog"
          className="relative rounded align-middle justify-center px-4 flex items-center group"
          resetScroll
        >
          <SeeMoreButton label="More Posts" />
        </Link>
      </div>
    </IntroCard>
  );
}

function ProjectsIntro() {
  return (
    <IntroCard title="My Research">
      <div className="grid grid-cols-1 gap-4">
        <Link to={`/projects/shelf-nitrate-response-to-upwelling`} resetScroll>
          <div className="flex flex-col p-4 rounded-lg group">
            <div className="flex space-x-2 mb-2">
              <h3 className="text-lg font-bold underline decoration-transparent group-hover:decoration-inherit transition-[text-decoration-color] duration-500 m-0">
                Shelf Nitrate Response to Upwelling on the Oregon Coast
              </h3>
              <div className="relative -translate-x-2 dark:text-dawn-pink-100 text-night-sky-950">
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-2 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-4 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-6 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="text-sm mb-auto">
              Nitrate is a key nutrient for marine ecosystems, particularly in
              the Pacific Northwest coastal ocean. Using nearly a decade of
              in-situ nitrate data from profilers on the Newport Hydrographic
              Line, I am investigating how physical processes such as coastal,
              wind-driven upwelling effect the nitrate concentration on the
              Oregon continental shelf.
            </p>
          </div>
        </Link>
        <div className="flex justify-center mx-auto my-1 bg-night-sky-950 dark:bg-dawn-pink-100 h-0.5 w-2/3" />
      </div>
      <div className="flex justify-center mt-5">
        <Link
          to="/projects/$category"
          params={{ category: "research" }}
          className="relative rounded align-middle justify-center px-4 flex items-center group"
          resetScroll
        >
          <SeeMoreButton label="More Research" />
        </Link>
      </div>
    </IntroCard>
  );
}

function SoftwareIntro() {
  return (
    <IntroCard title="Select Software">
      <div className="grid grid-cols-1 gap-4">
        <a
          href="https://pycoare.readthedocs.io/en/latest/?badge=latest"
          target="_blank"
        >
          <div className="flex flex-col p-4 rounded-lg group">
            <div className="flex space-x-2 mb-2">
              <h3 className="text-lg font-bold underline decoration-transparent group-hover:decoration-inherit transition-[text-decoration-color] duration-500 m-0">
                PyCOARE
              </h3>
              <div className="relative -translate-x-2 dark:text-dawn-pink-100 text-night-sky-950">
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-2 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-4 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-6 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="text-sm mb-auto">
              A Python package for calculating various air-sea fluxes from bulk
              variables (e.g., wind speed, temperature, humidity), using the
              COARE algorithms developed through the TOGA-COARE project.
            </p>
          </div>
        </a>
        <div className="flex justify-center mx-auto my-1 bg-night-sky-950 dark:bg-dawn-pink-100 h-0.5 w-2/3" />
        <a
          href="https://github.com/andrew-s28/ooi-profiler-nitrate-retriever"
          target="_blank"
        >
          <div className="flex flex-col p-4 rounded-lg group">
            <div className="flex space-x-2 mb-2">
              <h3 className="text-lg font-bold underline decoration-transparent group-hover:decoration-inherit transition-[text-decoration-color] duration-500 m-0">
                OOI Profiler Nitrate Retriever
              </h3>
              <div className="relative -translate-x-2 dark:text-dawn-pink-100 text-night-sky-950">
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-2 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-4 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-6 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="text-sm mb-auto">
              A command line interface to simplify the retrieval of high-quality
              in situ nitrate data from Ocean Observatories Initiative Endurance
              Array profiling moorings. A quality control procedure is applied
              to the data and the data is binned vertically and in time before
              being saved locally.
            </p>
          </div>
        </a>
        <div className="flex justify-center mx-auto my-1 bg-night-sky-950 dark:bg-dawn-pink-100 h-0.5 w-2/3" />
        <a
          href="https://github.com/andrew-s28/physoce-datasets"
          target="_blank"
        >
          <div className="flex flex-col p-4 rounded-lg group">
            <div className="flex space-x-2 mb-2">
              <h3 className="text-lg font-bold underline decoration-transparent group-hover:decoration-inherit transition-[text-decoration-color] duration-500 m-0">
                Physoce Datasets
              </h3>
              <div className="relative -translate-x-2 dark:text-dawn-pink-100 text-night-sky-950">
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-2 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-4 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
                <ChevronRight
                  className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 my-auto transform group-hover:translate-x-6 transition-[translate,opacity] duration-1000 ease-in-out"
                  size={20}
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="text-sm mb-auto">
              A Python package and command line interface aimed at standardizing
              the access of various oceanographic datasets and calculating
              derived parameters according to modern best practices.
            </p>
          </div>
        </a>
        <div className="flex justify-center mx-auto my-1 bg-night-sky-950 dark:bg-dawn-pink-100 h-0.5 w-2/3" />
      </div>
      <div className="flex justify-center mt-5">
        <a
          href="https://github.com/andrew-s28"
          className="relative rounded align-middle justify-center px-4 flex items-center group"
          target="_blank"
        >
          <SeeMoreButton label="More Software" />
        </a>
      </div>
    </IntroCard>
  );
}

function Waves({
  backgroundColor,
  strokeColor,
}: {
  backgroundColor?: string;
  strokeColor?: string;
}) {
  const wavePath =
    "10 0 10-10 20-10 2.34 0 4.25 1.9 4.25 4.25 0-1.03-.84-1.87-1.88-1.87-2.1 0-3.81 1.7-3.81 3.81 0 2.1 1.71 3.81 3.81 3.81 ";
  const waveWidth = 125;
  const { width: widthInit } = useWidth();
  const width = widthInit || 5000; // Fallback to 10000 if width is not available
  const waveRepeat = Math.max(Math.ceil(width / waveWidth), 10);
  const path = `M0 0C10 0 10-10 20-10c2.35 0 4.25 1.9 4.25 4.25 0-1.03-.84-1.87-1.87-1.87-2.11 0-3.81 1.7-3.81 3.81 0 2.1 1.7 3.81 3.81 3.81 ${wavePath.repeat(waveRepeat)}`;
  const color = `${backgroundColor || ""} ${strokeColor || ""}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 100 20"
      aria-hidden="true"
      height="120px"
      width={`${Math.max(width, 600).toFixed(0)}px`}
    >
      <rect
        x="0"
        y="-0.1"
        width={`${Math.max((waveRepeat * waveWidth) / 5, (10 * waveWidth) / 5).toFixed(0)}px`}
        height="10"
        className={color}
      />
      <path d={path} className={color} />
    </svg>
  );
}

function NightSky() {
  // inspired by https://codepen.io/jo_Geek/pen/EOKvLE
  const isSSR = useIsSSR();

  const milkyWayColors = [
    "#280F36",
    "#632B6C",
    "#BE6590",
    "#FFC1A0",
    "#FE9C7F",
  ];

  function HorizonGlow() {
    return (
      <div className="absolute -bottom-20 left-[10vw] w-[80vw] h-20 rounded-[50%] bg-horizon shadow-horizon"></div>
    );
  }
  function MilkyWay() {
    const nDivs = 150;
    const top = Array.from({ length: nDivs }, () => getRandom(0, 100));
    const left = Array.from({ length: nDivs }, () => getRandom(0, 100));
    const color = Array.from(
      { length: nDivs },
      () => milkyWayColors[Math.floor(getRandom(0, milkyWayColors.length))]
    );
    if (isSSR) {
      return <></>;
    }
    return zip(left, top, color).map(([l, t, c], i) => (
      <div
        key={i}
        className="absolute rounded-[50%] w-1.25 h-2.5"
        style={{
          left: `${String(l)}%`,
          top: `${String(t)}%`,
          backgroundColor: String(c),
          filter: "blur(15px)",
        }}
      ></div>
    ));
  }
  return (
    <>
      <HorizonGlow />
      <div className="absolute top-0 left-0 w-screen h-10 rotate-10 origin-top-left opacity-0 animate-stars-appear">
        <MilkyWay>
          {/* <Stars
            n={100}
            size={1}
            color="random"
            top={{ min: 0, max: 100 }}
            left={{ min: 0, max: 100 }}
            duration={{ min: 2, max: 4 }}
            shadow={{ size: "0px 0px 6px 1px", color: "rgba(255,255,255,0.5)" }}
          /> */}
        </MilkyWay>
      </div>
      <div className="opacity-0 animate-stars-appear">
        <Starfield
          configs={[
            {
              n: 500,
              size: 1,
              color: "#ffffff",
              top: { min: 0, max: 40 },
              left: { min: 0, max: 100 },
              duration: { min: 2, max: 5 },
            },
            {
              n: 500,
              size: 1.5,
              color: "#ffffff",
              top: { min: 0, max: 40 },
              left: { min: 0, max: 100 },
              duration: { min: 4, max: 8 },
            },
            {
              n: 150,
              size: 0.5,
              color: "#ffffff",
              top: { min: 0, max: 50 },
              left: { min: 0, max: 100 },
              duration: { min: 1, max: 2.5 },
            },
            {
              n: 150,
              size: 1,
              color: "#ffffff",
              top: { min: 0, max: 50 },
              left: { min: 0, max: 100 },
              duration: { min: 2.5, max: 4 },
            },
            {
              n: 150,
              size: 1.5,
              color: "#ffffff",
              top: { min: 0, max: 50 },
              left: { min: 0, max: 100 },
              duration: { min: 4, max: 5 },
            },
            {
              n: 100,
              size: 0.5,
              color: "#ffffff",
              top: { min: 40, max: 75 },
              left: { min: 0, max: 100 },
              duration: { min: 1, max: 3 },
            },
            {
              n: 100,
              size: 1,
              color: "#ffffff",
              top: { min: 40, max: 75 },
              left: { min: 0, max: 100 },
              duration: { min: 2, max: 4 },
            },
            {
              n: 250,
              size: 0.5,
              color: "#ffffff",
              top: { min: 0, max: 100 },
              left: { min: 0, max: 100 },
              duration: { min: 1, max: 2 },
            },
            {
              n: 250,
              size: 1,
              color: "#ffffff",
              top: { min: 0, max: 100 },
              left: { min: 0, max: 100 },
              duration: { min: 2, max: 5 },
            },
            {
              n: 250,
              size: 1.5,
              color: "#ffffff",
              top: { min: 0, max: 100 },
              left: { min: 0, max: 100 },
              duration: { min: 1, max: 4 },
            },
            {
              n: 250,
              size: 2.5,
              color: "#ffffff",
              top: { min: 0, max: 70 },
              left: { min: 0, max: 100 },
              duration: { min: 1, max: 4 },
              shadow: {
                size: "0px 0px 6px 1px",
                color: "rgba(255,255,255,0.5)",
              },
            },
            {
              n: 150,
              size: 2.5,
              color: "#ffffff",
              top: { min: 0, max: 100 },
              left: { min: 0, max: 100 },
              duration: { min: 5, max: 7 },
              shadow: {
                size: "0px 0px 6px 1px",
                color: "rgba(255,255,255,0.5)",
              },
            },
          ]}
        />
      </div>
    </>
  );
}

function Background() {
  return (
    <div className="absolute top-16 left-0 w-full overflow-clip">
      <div className="h-100 bg-night-sky-950 bg-linear-(--night-sky) relative contain-layout will-change-transform">
        <NightSky />
      </div>
      <div className="absolute top-90 left-0">
        <div className="flex h-30 justify-start w-full absolute animate-waves-top delay-1000 motion-reduce:animate-none motion-reduce:-translate-20">
          <Waves backgroundColor="fill-ocean-500" />
        </div>
        <div className="flex h-30 justify-start w-full absolute animate-waves-middle delay-1000 motion-reduce:animate-none motion-reduce:-translate-10">
          <Waves backgroundColor="fill-ocean-600" />
        </div>
        <div className="flex h-30 justify-start w-full absolute animate-waves-bottom">
          <Waves backgroundColor="fill-ocean-700" />
        </div>
      </div>
      <div className="relative h-[calc(100vh-464px)] bg-ocean-700 z-20"></div>
    </div>
  );
}

function Home() {
  const parent = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delay: 1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };
  return (
    <main className="overflow-clip bg-ocean-700">
      <Background />
      <div className="relative z-20 -mb-0.5">
        <div className="h-55">
          <HeroCard />
        </div>
        <div className="h-45"></div>
        <motion.div initial="hidden" animate="visible" variants={parent}>
          <BlogsIntro />
          <ProjectsIntro />
          <SoftwareIntro />
        </motion.div>
      </div>
    </main>
  );
}
