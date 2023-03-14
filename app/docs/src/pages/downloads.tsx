import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import Layout from "@theme/Layout";
import React from "react";

type Platform = "Linux" | "MacOS" | "Windows";

const latestVersion = "0.0.27";

// TODO: figure out how to make these dynamic
// TODO: add linux and windows url
const downloadUrls = {
  MacOS: `https://github.com/davidhu2000/kube-knots/releases/download/v${latestVersion}/kube-knots_${latestVersion}_x64.dmg`,
} as const;

export function DownloadButton({ platform }: { platform: Platform }): JSX.Element {
  return (
    <a
      href={downloadUrls[platform]}
      className="group relative flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-500/80 px-12 py-2 text-black shadow hover:bg-blue-500 hover:text-black hover:no-underline dark:bg-blue-600/80 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
    >
      <span className="text-xl">{platform}</span>
      <ArrowDownTrayIcon className="absolute right-4 h-5 w-5 opacity-0 transition duration-200 group-hover:opacity-80" />
    </a>
  );
}

export default function Downloads(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`Download ${siteConfig.title}`} description="Untangling the web of kubernetes">
      <main className="m-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl">Download Kube Knots</h1>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DownloadButton platform="MacOS" />
          <DownloadButton platform="Windows" />
          <DownloadButton platform="Linux" />
        </div>
      </main>
    </Layout>
  );
}
