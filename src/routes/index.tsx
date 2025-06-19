import React, { useEffect, useRef, ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useWindowSize } from "~/hooks/useWindowSize";
import { motion } from "motion/react";
import { useIsSSR } from "~/hooks/useIsSSR";
import hexToRgba from "hex-to-rgba";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";

export const Route = createFileRoute("/")({
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

function IntroCard() {
  return (
    <div className="flex flex-col h-full align-middle justify-center m-5">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{
          opacity: 1,
          translateY: 0,
          transition: { duration: 0.5, delay: 0.5 },
        }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <div className="bg-night-sky-950 text-dawn-pink-100 rounded-3xl px-5 py-2 w-fit mx-auto">
          <h1 className="text-[clamp(2rem,6vw,4rem)] text-center font-serif ">
            Andrew Scherer
          </h1>
          <h2 className="text-center text-[clamp(1rem,1vw,2rem)]">
            Physical Oceanographer <br /> Software Developer
          </h2>
        </div>
      </motion.div>
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

  const { width, height } = useWindowSize(true);
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

function HomePageSections({
  sectionTitle,
  sectionLink,
  children,
}: {
  sectionTitle: string;
  sectionLink: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center align-middle max-w-2xl mx-auto">
      <div className="my-5">
        <h2 className="text-[clamp(2rem,6vw,3rem)] font-serif text-dawn-pink-100 ">
          {sectionTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
      <div className="flex justify-center mt-5">
        {sectionLink ? (
          <Link
            to={sectionLink}
            className=" text-dawn-pink-100 hover:text-dawn-pink-200 flex items-center space-x-2"
          >
            <span className="text-xl">See More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function HomePageCards({
  title,
  description,
  link,
  external = false,
}: {
  title: string;
  description: string;
  link: string;
  external?: boolean;
}) {
  return (
    <Link to={link} target={external ? "_blank" : undefined}>
      <div className="flex flex-col p-4 bg-dawn-pink-100 dark:bg-night-sky-950 rounded-lg shadow-md group border border-night-sky-950 dark:border-dawn-pink-100">
        <h3 className="text-lg font-bold mb-2 group-hover:underline">
          {title}
        </h3>
        <p className="text-sm mb-auto">{description}</p>
      </div>
    </Link>
  );
}

function ProjectsIntro() {
  return (
    <div className=" bg-ocean-700 justify-center px-5">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{
          opacity: 1,
          translateY: 0,
          transition: { duration: 0.5, delay: 0.75 },
        }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <HomePageSections
          sectionTitle="Research"
          sectionLink="/projects/research"
        >
          <HomePageCards
            title="Shelf Nitrate Response to Upwelling on the Oregon Coast"
            description="Nitrate is a key nutrient for marine ecosystems, particularly in the Pacific Northwest coastal ocean. Using nearly a decade of in-situ nitrate data from profilers on the Newport Hydrographic Line, I am investigating how physical processes such as coastal, wind-driven upwelling effect the nitrate concentration on the Oregon continental
              shelf."
            link="/projects/posts/shelf-nitrate-response-to-upwelling"
          />
          <HomePageCards
            title="Lagrangian Particle Tracking in the California Current System"
            description="The ocean transports enormous amounts of heat, salt, and even tiny plankton! Lagrangian particle tracking is a powerful tool to understand ocean transport. I use Lagrangian particle tracking applied to long-term ocean velocity fields from satellites and models to understand how changes in ocean transport on yearly to decadal timescales effect the physical and biological properties of the Northern California Current System."
            link="/projects/posts/lagrangian-particle-tracking"
          />
        </HomePageSections>
      </motion.div>
    </div>
  );
}

function SoftwareIntro() {
  return (
    <div className="bg-ocean-700 justify-center px-5">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{
          opacity: 1,
          translateY: 0,
          transition: { duration: 0.5, delay: 1 },
        }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <HomePageSections sectionTitle="Software" sectionLink={null}>
          <HomePageCards
            title="pycoare"
            description="pycoare is a Python package for calculating various air-sea fluxes from bulk variables (e.g., wind speed, temperature, humidity), using the COARE algorithms developed through the TOGA-COARE project"
            link="https://pycoare.readthedocs.io/en/latest/?badge=latest"
            external
          />
          <HomePageCards
            title="OOI Profiler Nitrate Retriever"
            description="A command line interface to simplify the retrieval of high-quality in situ nitrate data from Ocean Observatories Initiative Endurance Array profiling moorings. A quality control procedure is applied to the data and the data is binned vertically and in time before being saved locally."
            link="https://github.com/andrew-s28/ooi-profiler-nitrate-retriever"
            external
          />
          <HomePageCards
            title="Scientific Data Analysis Template"
            description="This repository serves as a template for organizing and storing scientific analysis code in a structured and reproducible manner, with a particular focus on supporting Python notebook version control."
            link="https://github.com/andrew-s28/analysis-template"
            external
          />
        </HomePageSections>
      </motion.div>
    </div>
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
  const { width } = useWindowSize();
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
        className="absolute rounded-[50%] w-[5px] h-[10px]"
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
      <div className="absolute top-[0] left-[0] w-[100vw] h-10 rotate-10 origin-top-left opacity-0 animate-stars-appear">
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
        <div className="flex h-30 justify-start w-full absolute animate-waves-top motion-reduce:animate-none motion-reduce:-translate-20">
          <Waves backgroundColor="fill-ocean-500" />
        </div>
        <div className="flex h-30 justify-start w-full absolute animate-waves-middle motion-reduce:animate-none motion-reduce:-translate-10">
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
  return (
    <main className="overflow-clip bg-ocean-700">
      <Background />
      <div className="relative z-20 -mb-0.5">
        <div className="h-55">
          <IntroCard />
        </div>
        <div className="h-40"></div>
        <ProjectsIntro />
        <SoftwareIntro />
      </div>
    </main>
  );
}
