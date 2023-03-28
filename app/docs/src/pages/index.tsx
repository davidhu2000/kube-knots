import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
// @ts-expect-error this is how to import static assets in Docusaurus
import appScreenshotUrl from "@site/static/img/app-screenshot.png";
import Layout from "@theme/Layout";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout description={siteConfig.tagline}>
      <main className="my-12 mx-8 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2">
        <div className="">
          <img src={appScreenshotUrl} alt="Kube Knot Screenshot" />
        </div>
        <div className="flex max-w-md flex-col justify-center gap-y-4">
          <h1 className="m-0 text-5xl font-normal tracking-tight">
            Untangling the web of kubernetes with ease
          </h1>
          <h2 className="m-0 text-3xl font-normal tracking-tight">
            Manage your cluster straight from your desktop
          </h2>
          <Link
            to="/downloads"
            className={`umami--click--download-button-main group relative my-4 flex	w-48 items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-12 py-2 text-black shadow hover:bg-blue-500 hover:text-black hover:no-underline dark:bg-blue-600/80 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white`}
          >
            Download
          </Link>
          <div>Available on macOs, Linux and Windows.</div>
        </div>
      </main>
    </Layout>
  );
}
