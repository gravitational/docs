import { useCallback, useContext, useEffect } from "react";
import { VarsContext } from "./context";
import styles from "./Var.module.css";

interface VarProps {
  name: string;
  needLabel?: boolean;
}

export const Var = ({ name, needLabel }: VarProps) => {
  const { fields, setField } = useContext(VarsContext);

  const onChange = useCallback(
    (event) => {
      setField(name, event.target.value);
    },
    [name, setField]
  );

  useEffect(() => {}, [fields]);

  const input = (
    <>
      <input
        className={styles.field}
        type="text"
        size={name.length}
        name={name}
        placeholder={name}
        onChange={onChange}
        value={fields[name] || ""}
      />
      <span className={styles["fake-field"]}>{fields[name] || ""}</span>
      <span className={styles.icon}></span>
    </>
  );

  if (needLabel) {
    return (
      <label className={styles.label}>
        {name}:{input}
      </label>
    );
  }

  return <div className={styles.wrapper}>{input}</div>;
};
