import { createFileRoute } from "@tanstack/react-router";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/privacy")({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "Privacy Policy - Andrew Scherer",
        description: "My privacy policy and views on web privacy.",
        keywords: "privacy, policy, Andrew Scherer, personal website",
      }),
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto px-5 flex flex-col justify-start min-h-[calc(100vh-64px)]">
      <div className="flex flex-col justify-start my-10">
        <h1 className="text-4xl font-bold font-serif capitalize">
          Privacy Policy
        </h1>
        <p className="text-xl font-semibold my-3">
          There is no privacy policy needed here!
        </p>
        <p className="text-lg my-3">
          I believe good websites are fast, responsive, and, critically,
          <strong> ad-free and tracking-free</strong>; this site is built to
          those principals. Browse this site with the freedom of knowing your
          data is only yours, the way the web ought to be!
        </p>
      </div>
    </div>
  );
}
