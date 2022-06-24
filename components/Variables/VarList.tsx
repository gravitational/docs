import { useContext } from "react";
import { Var } from "./Var";
import { VarsContext } from "./context";
import styles from "./VarList.module.css";

export const VarList = () => {
  const { fields, globalFields } = useContext(VarsContext);

  const globalFieldsList = Object.keys(globalFields)?.map((item, iter) => {
    return (
      <li className={styles.item} key={iter}>
        <Var name={item} needLabel isGlobal />
      </li>
    );
  });

  const pageFields = Object.keys(fields)
    .map((field) => {
      if (
        Object.keys(globalFields).length === 0 ||
        !Object.keys(globalFields)?.includes(field)
      ) {
        return field;
      }

      return;
    })
    .filter(Boolean);

  const pageFieldsList = pageFields?.map((item, iter) => {
    return (
      <li className={styles.item} key={iter}>
        <Var name={item} needLabel />
      </li>
    );
  });

  const html =
    Object.keys(fields).length > 0 ? (
      <section>
        <p className={styles.text}>
          You can fill in the variables for more comfortable use of the
          documentation
        </p>
        <h2 className={styles.title}>Documentation wide variables</h2>
        {Object.keys(globalFields).length > 0 && (
          <ul className={styles.list}>{globalFieldsList}</ul>
        )}
        <h2 className={styles.title}>Page wide variables</h2>
        {pageFields.length > 0 && (
          <ul className={styles.list}>{pageFieldsList}</ul>
        )}
      </section>
    ) : (
      <></>
    );

  return html;
};
