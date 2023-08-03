import { useEffect } from "react";
import cn from "classnames";
import { useContext } from "react";
import Icon from "components/Icon";
import { VarsContext } from "./context";
import type { VarsContextProps } from "./context";
import styles from "./Var.module.css";

interface VarProps {
  name?: string;
  description?: string;
  needLabel?: boolean;
  isGlobal?: boolean;
  initial?: string;
}

export const Var = ({
  name,
  description = "",
  needLabel = false,
  isGlobal = false,
  initial = "",
}: VarProps) => {
  const { fields, initials, putField, setInitial } =
    useContext<VarsContextProps>(VarsContext);
  let defaultVal = initial;
  const val = fields[name] || initials[name] || initial || "";

  const onChange = (event) => {
    putField(name, event.target.value, isGlobal, description);
  };

  // Update VarsContext after the Var renders. Once VarsContext re-renders, it
  // also re-renders the rest of the DOM with the variable's initial value.
  // The dependency array after the useEffect callback prevents an infinite
  // render loop.
  //
  // This is not the intended purpose of useEffect, so we should eventually find
  // a better way to do this.
  useEffect(() => {
    if (!initials[name] && initial) {
      setInitial(name, initial);
    }
  }, [name, initial, initials, setInitial]);

  const input = (
    <>
      <input
        data-testid="var-input"
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

  return <span className={cn("wrapper-input", styles.wrapper)}>{input}</span>;
};
