import cn from "classnames";
import { useCallback, useContext, useEffect } from "react";
import { VarsContext } from "./context";
import type { VarsContextProps } from "./context";
import styles from "./Var.module.css";

interface VarProps {
  name: string;
  description?: string;
  needLabel?: boolean;
  isGlobal?: boolean;
  isDictionary?: boolean;
}

export const Var = ({
  name,
  description = "",
  needLabel = false,
  isGlobal = false,
  isDictionary = false,
}: VarProps) => {
  const { fields, setField, addField } =
    useContext<VarsContextProps>(VarsContext);
  const val = fields[name] || "";

  useEffect(() => {
    addField(name, isGlobal, description);
  }, [isGlobal, name, addField, description]);

  const onChange = useCallback(
    (event) => {
      setField(name, event.target.value, description);
    },
    [name, setField, description]
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
        value={val}
      />
      <span className={styles["fake-field"]}>{val}</span>
      <span className={styles.icon}></span>
    </>
  );

  if (needLabel) {
    if (isDictionary && description) {
      return (
        <label className={styles.label}>
          {description}:{input}
        </label>
      );
    }

    return (
      <label className={styles.label}>
        {name}:{input}
      </label>
    );
  }

  return <div className={cn("wrapper-input", styles.wrapper)}>{input}</div>;
};
