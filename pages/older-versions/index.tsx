import Head from "components/Head";
import Link from "next/link";
import SiteHeader from "components/Header";
import Header from "layouts/DocsPage/Header";
import Footer from "layouts/DocsPage/Footer";
import styles from "./OldVersions.module.css";

const oldVersions = [
  {
    label: "Teleport v8",
    href: "https://github.com/gravitational/teleport/tree/branch/v8",
  },
  {
    label: "Teleport v7",
    href: "https://github.com/gravitational/teleport/tree/branch/v7",
  },
  {
    label: "Teleport v6",
    href: "https://github.com/gravitational/teleport/tree/branch/v6",
  },
  {
    label: "Teleport v5",
    href: "https://github.com/gravitational/teleport/tree/branch/v5",
  },
  {
    label: "Teleport v4",
    href: "https://github.com/gravitational/teleport/tree/branch/v4",
  },
];

const OldVersions = () => {
  let title = `Older Versions`;

  return (
    <>
      <Head title="Older Versions" titleSuffix="Teleport Docs" />
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.body}>
          <Header title={title} scopes={["noScope"]} />
          <div className={styles.content}>
            <p>
              Deprecated versions of the Teleport docs can be found at the
              GitHub links below:
            </p>
            {oldVersions.map((ver) => (
              <div key={ver.label} className={styles.link}>
                <a href={ver.href}>{ver.label}</a>
              </div>
            ))}
            <div>
              You can also{" "}
              <Link href="/">return to the main documentation site.</Link>
            </div>
          </div>
          <Footer>
            <div className={styles.footer}></div>
          </Footer>
        </div>
      </main>
    </>
  );
};

export default OldVersions;
