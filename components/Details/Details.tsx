import { css } from "@styled-system/css";
import { useContext, useEffect, useState, useMemo } from "react";
import Box from "components/Box";
import Flex from "components/Flex";
import HeadlessButton from "components/HeadlessButton";
import Icon from "components/Icon";
import { transition } from "components/system";
import { DocsContext, ScopesType, getScopes } from "layouts/DocsPage/context";

export interface DetailsProps {
  scope?: ScopesType;
  title: string;
  opened?: boolean;
  scopeOnly: boolean;
  min: string;
  children: React.ReactNode;
}

export const Details = ({
  scope,
  scopeOnly = false,
  opened,
  title,
  min,
  children,
}: DetailsProps) => {
  const {
    scope: currentScope,
    versions: { current, latest },
  } = useContext(DocsContext);
  const scopes = useMemo(() => getScopes(scope), [scope]);
  const [isOpened, setIsOpened] = useState<boolean>(Boolean(opened));
  const isInCurrentScope = scopes.includes(currentScope);

  useEffect(() => {
    if (scopes.length) {
      setIsOpened(isInCurrentScope);
    }
  }, [scopes, isInCurrentScope]);

  const isCloudAndNotCurrent = scopes.includes("cloud") && current !== latest;
  const isHiddenInCurrentScope = scopeOnly && !isInCurrentScope;
  const isHidden = isCloudAndNotCurrent || isHiddenInCurrentScope;

  return (
    <Box
      bg="white"
      boxShadow={isOpened ? "0 1px 4px rgba(0, 0, 0, 0.24)" : "none"}
      borderRadius="default"
      mb={3}
      display={isHidden ? "none" : "block"}
      css={css({
        "&:last-child": {
          mb: 0,
        },
      })}
    >
      <HeadlessButton
        onClick={() => setIsOpened((value) => !value)}
        width="100%"
        textAlign="left"
        fontSize="text-md"
        fontWeight="bold"
        lineHeight="sm"
        color="darkest"
        display="flex"
        alignItems="center"
        cursor="pointer"
        py={2}
        bg={isOpened ? "lightest-gray" : "none"}
        transition={transition([["backgroundColor", "interaction"]])}
        borderTopLeftRadius="default"
        borderTopRightRadius="default"
        css={css({
          "&:hover, &:active, &:focus": {
            color: "light-purple",
            outline: "none",
          },
        })}
      >
        <Icon
          name="arrow"
          width={["24px", "16px"]}
          height={["24px", "16px"]}
          mx={2}
          transition={transition([["transform", "fast"]])}
          transform={isOpened ? "rotate(180deg)" : "rotate(0deg)"}
          flexShrink={0}
        />
        <Flex flexDirection={["column", "row"]}>
          <Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            {title}
          </Box>
          {(scopes || min) && (
            <Flex
              alignItems="center"
              ml={[0, 2]}
              mt={[1, 0]}
              mr={2}
              flexShrink={0}
            >
              {scopes && (
                <Flex>
                  {scopes.map((scope) => (
                    <Box
                      key={scope}
                      bg={isOpened ? "dark-purple" : "lightest-gray"}
                      color={isOpened ? "white" : "gray"}
                      fontSize="text-xs"
                      lineHeight="20px"
                      textTransform="uppercase"
                      mr={2}
                      px={2}
                      borderRadius="sm"
                    >
                      {scope}
                    </Box>
                  ))}
                </Flex>
              )}
              {min && (
                <Box
                  fontWeight="regular"
                  fontSize="text-xs"
                  lineHeight="20px"
                  color="gray"
                >
                  VERSION {min}+
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </HeadlessButton>
      <Box display={isOpened ? "block" : "none"} p={[2, 3]} overflowX="auto">
        {children}
      </Box>
    </Box>
  );
};
