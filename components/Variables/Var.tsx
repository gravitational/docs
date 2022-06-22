import cn from "classnames";
import { useCallback, useContext, useEffect } from "react";
import { VarsContext } from "./context";
import styles from "./Var.module.css";

interface VarProps {
  name: string;
  needLabel?: boolean;
  isGlobal?: boolean;
}

export const Var = ({ name, needLabel, isGlobal }: VarProps) => {
  const { fields, setField } = useContext(VarsContext);

  useEffect(() => {
    if (isGlobal) {
      const fieldValue = sessionStorage.getItem(`global_var_${name}`);
      if (fieldValue) {
        setField(name, fieldValue);
      }
    }
  }, [name, setField, isGlobal]);

  const onChange = useCallback(
    (event) => {
      setField(name, event.target.value);

      if (isGlobal) {
        sessionStorage.setItem(`global_var_${name}`, event.target.value);
      }
    },
    [name, setField, isGlobal]
  );

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

  return <div className={cn("wrapper-input", styles.wrapper)}>{input}</div>;
};
