import styled from "styled-components";
import css from "@styled-system/css";
import {
  isValidElement,
  Children,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { variant } from "components/system";
import Box from "components/Box";
import Flex from "components/Flex";
import HeadlessButton from "components/HeadlessButton";
import { VersionWarning } from "layouts/DocsPage";
import { DocsContext, getScopes } from "layouts/DocsPage/context";
import { ScopesType } from "layouts/DocsPage/types";

const getSelectedLabel = (
  tabs: React.ReactComponentElement<typeof TabItem>[]
): string => {
  const selectedTab = tabs.find(({ props: { selected } }) => selected);

  return selectedTab ? selectedTab.props.label : tabs[0]?.props.label;
};

export interface TabItemProps {
  selected?: boolean;
  scope?: ScopesType;
  label: string;
  children: React.ReactNode;
}

export const TabItem = ({ children }: TabItemProps) => {
  return (
    <Box p={[2, 3]} overflowX="auto">
      {children}
    </Box>
  );
};

interface TabsLabel {
  selected: boolean;
  label: string;
  onClick: (label: string) => void;
}

const TabLabel = ({ selected, label, onClick }: TabsLabel) => {
  return (
    <Label
      disabled={selected}
      onClick={() => onClick(label)}
      variant={selected ? "selected" : "default"}
      px={[3, 5]}
      py={2}
      borderTopLeftRadius="default"
      borderTopRightRadius="default"
      fontSize="text-md"
      fontWeight="bold"
      lineHeight="md"
    >
      {label}
    </Label>
  );
};

export interface TabsProps {
  children: React.ReactNode;
}

export const Tabs = ({ children }: TabsProps) => {
  const {
    scope,
    versions: { latest, current },
  } = useContext(DocsContext);

  const childTabs = useMemo(
    () =>
      Children.toArray(children).filter(
        (c) => isValidElement(c) && c.props.label && c.props.children
      ) as React.ReactComponentElement<typeof TabItem>[],
    [children]
  );

  const labels = childTabs.map(({ props: { label } }) => label);

  const [currentLabel, setCurrentLabel] = useState(getSelectedLabel(childTabs));

  useEffect(() => {
    const scopedTab = childTabs.find(({ props }) =>
      getScopes(props.scope).includes(scope)
    );

    if (scopedTab) {
      setCurrentLabel(scopedTab.props.label);
    }
  }, [scope, childTabs]);

  return (
    <Box
      bg="white"
      boxShadow="0 1px 4px rgba(0,0,0,.24)"
      borderRadius="default"
      mb={3}
      css={css({
        "&:last-child": {
          mb: 0,
        },
      })}
    >
      <Flex
        bg="lightest-gray"
        overflowX="auto"
        height="auto"
        borderTopLeftRadius="default"
        borderTopRightRadius="default"
      >
        {labels.map((label) => (
          <TabLabel
            key={label}
            label={label}
            onClick={setCurrentLabel}
            selected={label === currentLabel}
          />
        ))}
      </Flex>
      {childTabs.map((tab) => {
        return (
          <Box
            key={tab.props.label}
            display={tab.props.label === currentLabel ? "block" : "none"}
          >
            {tab.props.scope === "cloud" && latest !== current ? (
              <TabItem label={tab.props.label}>
                <VersionWarning />
              </TabItem>
            ) : (
              tab
            )}
          </Box>
        );
      })}
    </Box>
  );
};

Tabs.Item = TabItem;

const Label = styled(HeadlessButton)<{ variant: "default" | "selected" }>(
  css({
    whiteSpace: "nowrap",
    flexShrink: 0,
    m: 0,
    "&:hover, &:active, &:focus": {
      color: "darkest",
      outline: "none",
    },
  }),
  variant({
    variants: {
      default: {
        color: "gray",
        cursor: "pointer",
      },
      selected: {
        pointerEvents: "none",
        bg: "white",
        color: "dark-purple",
      },
    },
  })
);
