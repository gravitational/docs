import cn from "classnames";
import { useCallback, useContext, useEffect } from "react";
import Icon from "components/Icon";
import { VarsContext } from "./context";
import type { VarsContextProps } from "./context";
import styles from "./Var.module.css";

interface VarProps {
  name?: string;
  description?: string;
  needLabel?: boolean;
  isGlobal?: string;
}

export const Var = ({
  name,
  description = "",
  needLabel = false,
  isGlobal = "false",
}: VarProps) => {
  const { fields, setField, addField } =
    useContext<VarsContextProps>(VarsContext);
  const val = fields[name] || "";

  useEffect(() => {
    addField(name, isGlobal === "true", description);
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
        size={val.length || name.length}
        name={name}
        placeholder={name}
        onChange={onChange}
        value={val}
      />
      <span className={styles["fake-field"]}>{val || name}</span>
      <Icon name="edit" className={styles.icon} />
    </>
  );

  const label = description ? description : name;

  if (needLabel) {
    return (
      <label className={styles.label}>
        {label}:{input}
      </label>
    );
  }

  return <div className={cn("wrapper-input", styles.wrapper)}>{input}</div>;
};
