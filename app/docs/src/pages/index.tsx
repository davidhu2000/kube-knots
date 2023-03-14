import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// @ts-expect-error this is how to import static assets in Docusaurus
import appScreenshotUrl from "@site/static/img/app-screenshot.png";
import Layout from "@theme/Layout";
import React from "react";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="Untangling the web of kubernetes">
      <main className="my-12 mx-8 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2">
        <div className="flex max-w-md flex-col justify-center">
          <div className="text-4xl">Untangling the web of kubernetes with ease.</div>
          <Link
            to="/downloads"
            className="group relative	my-4 flex w-48 items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-12 py-2 shadow hover:bg-blue-500 hover:text-black hover:no-underline dark:bg-blue-600/80 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            Download
          </Link>
          <div>Available on macOS, Windows and Linux.</div>
        </div>
        <div className="">
          <img src={appScreenshotUrl} />
        </div>
      </main>
    </Layout>
  );
}
