import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
// @ts-expect-error this is how to import static assets in Docusaurus
import appLogoUrl from "@site/static/img/StoreLogo.png";
import Layout from "@theme/Layout";
import React from "react";

import appPackageJson from "../../../kube-knots/package.json";

const latestVersion = appPackageJson.version;

// TODO: add linux and windows url which auto adds the download button
const downloadUrls = {
  "macOS (.dmg)": `https://github.com/davidhu2000/kube-knots/releases/download/v${latestVersion}/Kube.Knots_${latestVersion}_x64.dmg`,
  "linux (.AppImage)": `https://github.com/davidhu2000/kube-knots/releases/download/v${latestVersion}/kube-knots_${latestVersion}_amd64.AppImage`,
  "linux Ubuntu (.deb)": `https://github.com/davidhu2000/kube-knots/releases/download/v${latestVersion}/kube-knots_${latestVersion}_amd64.deb`,
  "windows (.msi)": `https://github.com/davidhu2000/kube-knots/releases/download/v${latestVersion}/Kube.Knots_${latestVersion}_x64_en-US.msi`,
} as const;

export const availablePlatforms = Object.keys(downloadUrls) as (keyof typeof downloadUrls)[];

type Platform = (typeof availablePlatforms)[number];

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
    <Layout title={`Downloads`} description={siteConfig.tagline}>
      <main className="m-auto flex flex-col items-center justify-center">
        <div className="flex items-center justify-center ">
          <img src={appLogoUrl} className="mr-2" />
          <h1 className="m-0 text-4xl">Download Kube Knots</h1>
        </div>

        <div className={`mt-12 grid grid-cols-1 gap-4`}>
          {availablePlatforms.map((platform) => (
            <DownloadButton key={platform} platform={platform} />
          ))}
        </div>

        <div className="mt-12 text-center">
          See <a href="docs/category/installation">installation instructions</a> for all platforms
        </div>
      </main>
    </Layout>
  );
}
