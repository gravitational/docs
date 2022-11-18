import { useContext } from "react";
import { Var } from "./Var";
import { VarsContext } from "./context";
import type { VarsContextProps } from "./context";
import styles from "./VarList.module.css";

export const VarList = () => {
  const { fields, globalFields, fieldDescriptions } =
    useContext<VarsContextProps>(VarsContext);
  const globalFieldsList = Object.keys(globalFields).map((item) => (
    <li className={styles.item} key={item}>
      <Var
        name={item}
        description={fieldDescriptions[item]}
        needLabel
        isGlobal={true}
      />
    </li>
  ));

  const pageFields = Object.keys(fields)
    .map((field) => (field in globalFields ? undefined : field))
    .filter(Boolean);

  const pageFieldList = pageFields.map((item) => (
    <li className={styles.item} key={item}>
      <Var name={item} description={fieldDescriptions[item]} needLabel />
    </li>
  ));

  if (!globalFieldsList.length && !pageFieldList.length) {
    return <></>;
  }

  return (
    <section>
      {!!globalFieldsList.length && (
        <>
          <h2 className={styles.title}>Documentation-wide variables</h2>
          <ul className={styles.list}>{globalFieldsList}</ul>
        </>
      )}
      {!!pageFieldList.length && (
        <>
          <h2 className={styles.title}>Page-wide variables</h2>
          <ul className={styles.list}>{pageFieldList}</ul>
        </>
      )}
    </section>
  );
};
