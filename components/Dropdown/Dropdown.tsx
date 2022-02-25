import { ReactNode } from "react";
import css from "@styled-system/css";
import styled from "styled-components";
import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import "@reach/listbox/styles.css";
import Box, { BoxProps } from "components/Box";
import Icon from "components/Icon";
import { all, transition, StyledSystemProps } from "components/system";

export type DropdownProps<T> = {
  options: T[];
  value?: string;
  pickValue?: (item: T) => string;
  pickOption?: (options: T[], id: string) => T;
  renderOption?: (option: T) => ReactNode;
  pickId?: (item: T) => string;
  onChange: (selected: string) => void;
  icon?: ReactNode;
  color?: string;
  needBg?: boolean;
} & BoxProps;

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
  color,
  needBg,
  ...props
}: DropdownProps<T>) {
  return (
    <Box {...props}>
      <StyledListboxInput
        color={color ? color : "white"}
        bg={needBg ? "white" : "transparent"}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <StyledListboxButton arrow={icon} borderColor={color ? color : "white"}>
          {renderOption(value ? pickOption(options, value) : options[0])}
        </StyledListboxButton>
        <StyledListboxPopover>
          <ListboxList>
            {options.map((option) => {
              const id = pickId(option);

              return (
                <StyledListboxOption key={id} value={id}>
                  {renderOption(option)}
                </StyledListboxOption>
              );
            })}
          </ListboxList>
        </StyledListboxPopover>
      </StyledListboxInput>
    </Box>
  );
}

const StyledListboxInput = styled(ListboxInput)<StyledSystemProps>(
  css({
    display: "inline-flex",
    width: "100%",
    whiteSpace: "nowrap",
  }),
  all
);

const StyledListboxButton = styled(ListboxButton)<StyledSystemProps>(
  css({
    display: "flex",
    alignItems: "center",
    fontSize: ["text-md", "text-sm"],
    fontWeight: "bold",
    lineHeight: "30px",
    cursor: "pointer",
    border: "1px solid",
    borderRadius: "default",
    px: 2,
    py: 0,
    width: "100%",
    transition: transition([["backgroundColor", "interaction"]]),
    "&:active, &:focus, &:hover": {
      outline: "none",
      bg: "rgba(255, 255, 255, 0.12)",
    },
    '&[aria-disabled="true"]': {
      pointerEvents: "none",
    },
    "& [data-reach-listbox-arrow]": {
      width: "16px",
      height: "16px",
      ml: 3,
      transition: transition([["transform", "interaction"]]),
      transform: "rotate(0deg)",
    },
    [`& [data-reach-listbox-arrow][data-expanded]`]: {
      transform: "rotate(180deg)",
    },
  }),
  all
);

const StyledListboxPopover = styled(ListboxPopover)<StyledSystemProps>(
  css({
    border: "none",
    borderRadius: "sm",
    boxShadow: "0 4px 16px rgba(0,0,0,.24) !important",
    "&:focus-within": {
      outline: "none",
    },
  })
);

const StyledListboxOption = styled(ListboxOption)(
  css({
    fontSize: ["text-md", "text-sm"],
    fontWeight: "bold",
    lineHeight: "30px",
    px: 2,
    cursor: "pointer",
    transition: transition([["background", "interaction"]]),
    "&:hover, &:focus, &:active, &[aria-selected='true']": {
      color: "black",
      bg: "lightest-gray",
    },
    "&[data-current]": {
      bg: "lightest-gray",
      color: "dark-purple",
    },
    "&:first-child": {
      borderTopLeftRadius: "sm",
      borderTopRightRadius: "sm",
    },
    "&:last-child": {
      borderBottomLeftRadius: "sm",
      borderBottomRightRadius: "sm",
    },
  })
);
