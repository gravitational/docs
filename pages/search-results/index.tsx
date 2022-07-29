import { useState } from "react";
import Head from "components/Head";
import SiteHeader from "components/Header";
import Header from "layouts/DocsPage/Header";
import { SeparateSearch } from "components/Search";
import Footer from "layouts/DocsPage/Footer";
import { unpackSearchResults } from "utils/general";
import styles from "./SearchResults.module.css";

const SearchResults = () => {
  const [savedSearchResults] = useState(() => unpackSearchResults());
  const version = savedSearchResults?.version || "current";
  let title = `Search Results`;

  if (version !== "current") {
    title += ` for version ${version} documentation`;
  }

  return (
    <>
      <Head title="Search Results" titleSuffix="Teleport Docs" />
      <SiteHeader />
      <main className={styles.wrapper}>
        <div className={styles.body}>
          <Header title={title} scopes={["noScope"]} />
          <SeparateSearch />
          <Footer>
            <div className={styles.footer}></div>
          </Footer>
        </div>
      </main>
    </>
  );
};

export default SearchResults;
