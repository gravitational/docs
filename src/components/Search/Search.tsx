import React from "react";

import styles from "./Search.module.css";
import { InkeepSearch } from "./InkeepSearch";

export default function Search() {
  return (
    <div className={styles["wrapper-autocomplete"]}>
      <InkeepSearch />
    </div>
  );
}
