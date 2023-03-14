import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Untangling the web of kubernetes">
      <header>Header</header>
      <main>
        <div>content</div>
      </main>
    </Layout>
  );
}
