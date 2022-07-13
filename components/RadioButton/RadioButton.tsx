import cn from "classnames";
import Icon from "components/Icon";
import type { IconName } from "components/Icon/types";
import styles from "./RadioButton.module.css";

export type RadioButtonVariant = "gray" | "green" | "blue";

interface RadioButtonProps {
  name: string;
  id: string;
  value: string;
  variant?: RadioButtonVariant;
  icon?: IconName;
  label?: string;
  className?: string;
  checked?: boolean;
}

export const RadioButton = ({
  name,
  id,
  value,
  variant,
  icon,
  label,
  className,
  checked,
}: RadioButtonProps) => {
  const labelText = label ? label : value;

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        type="radio"
        name={name}
        id={id}
        checked={checked}
      />
      <label
        className={cn(styles.label, styles[`variant-${variant}`], className)}
        htmlFor={id}
      >
        {icon && <Icon name={icon} className={styles.icon} />} {labelText}
      </label>
    </div>
  );
};
