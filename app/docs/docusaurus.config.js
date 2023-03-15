// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const githubLink = "https://github.com/davidhu2000/kube-knots";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Kube Knots",
  tagline: "Untangling the web of kubernetes",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://davidhu.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/kube-knots/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "davidhu2000  ", // Usually your GitHub org/user name.
  projectName: "kube-knots", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/davidhu2000/kube-knots/tree/main/app/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/davidhu2000/kube-knots/tree/main/app/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-CQWQ1VCWD7",
          anonymizeIP: true,
        },
      }),
    ],
  ],
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Kube Knots",
        logo: {
          alt: "Logo",
          src: "img/StoreLogo.png",
        },
        items: [
          { to: "/downloads", label: "Downloads", position: "left" },
          { type: "doc", docId: "intro/index", position: "left", label: "Docs" },
          { to: "/blog", label: "Blog", position: "left" },
          { to: githubLink, label: "GitHub", position: "right" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            label: "Bocs",
            to: "/docs/intro",
          },
          {
            label: "Blog",
            to: "/blog",
          },
          {
            label: "GitHub",
            to: githubLink,
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Kube Knots, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
