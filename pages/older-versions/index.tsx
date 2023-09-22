import Head from "components/Head";
import Link from "next/link";
import SiteHeader from "components/Header";
import Header from "layouts/DocsPage/Header";
import Footer from "layouts/DocsPage/Footer";
import styles from "./styles.module.css";

import config from "../../config.json";

const githubUrl = "https://github.com/gravitational/teleport/tree";

const OldVersions = () => {
  let title = `Older Versions`;
  const deprecated = config.versions.filter((ver) => ver.deprecated);

  return (
    <>
      <Head title="Older Versions" titleSuffix="Teleport Docs" />
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.body}>
          <Header
            title={title}
            scopes={["noScope"]}
            isVersionAgnosticPage={true}
          />
          <div className={styles.content}>
            <p>
              Deprecated versions of the Teleport docs can be found at the
              GitHub links below:
            </p>
            {deprecated
              .reverse()
              .filter((ver) => ver.deprecated)
              .map((ver) => (
                <div key={ver.branch} className={styles.link}>
                  <a
                    href={`${githubUrl}/${ver.branch}`}
                  >{`Teleport ${ver.name}`}</a>
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
