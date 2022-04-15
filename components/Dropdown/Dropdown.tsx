import cn from "classnames";
import { ReactNode } from "react";
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import "@reach/listbox/styles.css";
import Icon from "components/Icon";
import * as styles from "./Dropdown.css";

export type DropdownProps<T> = {
  options: T[];
  value?: string;
  pickValue?: (item: T) => string;
  pickOption?: (options: T[], id: string) => T;
  renderOption?: (option: T) => ReactNode;
  pickId?: (item: T) => string;
  onChange: (selected: string) => void;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

const echo = <T,>(thing: T): any => thing;
const echoOption = <T,>(options: T[], id: string): any => id;

const defaultIcon = <Icon name="arrow" size="sm" />;

export function Dropdown<T>({
  value,
  icon = defaultIcon,
  options,
  onChange,
  renderOption = echo,
  pickId = echo,
  pickOption = echoOption,
  disabled,
  className,
}: DropdownProps<T>) {
  return (
    <ListboxInput
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(styles.input, className)}
    >
      <ListboxButton arrow={icon} className={styles.button}>
        {renderOption(value ? pickOption(options, value) : options[0])}
      </ListboxButton>
      <ListboxPopover className={styles.popover}>
        <ListboxList>
          {options.map((option) => {
            const id = pickId(option);

            return (
              <ListboxOption key={id} value={id} className={styles.option}>
                {renderOption(option)}
              </ListboxOption>
            );
          })}
        </ListboxList>
      </ListboxPopover>
    </ListboxInput>
  );
}
