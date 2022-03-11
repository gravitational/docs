import { useContext } from "react";
import Box from "components/Box";
import Button from "components/Button";
import Flex from "components/Flex";
import Icon, { IconName } from "components/Icon";
import Section from "components/Section";
import { Scopes } from "./Scopes";
import Versions from "./Versions";
import NextImage from "next/image";
import { VersionsInfo } from "./types";
import { DocsContext } from "./context";
import forkmeSrc from "./assets/forkme.webp";

interface DocHeaderProps {
  title: string;
  icon?: IconName;
  versions: VersionsInfo;
  githubUrl: string;
}

const GITHUB_DOCS = process.env.NEXT_PUBLIC_GITHUB_DOCS;

const DocHeader = ({
  title,
  icon = "book",
  versions,
  githubUrl,
}: DocHeaderProps) => {
  const { scope } = useContext(DocsContext);

  return (
    <Section bg="purple">
      <Flex position="relative" minHeight="168px" alignItems="stretch">
        <Box as="a" href={GITHUB_DOCS} position="absolute" top="0" right="0">
          <NextImage
            width="112"
            height="112"
            src={forkmeSrc}
            alt="Fork me on GitHub"
          />
        </Box>
        <Flex flexGrow={1}>
          <Icon
            name={icon}
            color="white"
            size="xl"
            ml="56px"
            mt="56px"
            mr={3}
            flexShrink={0}
            display={["none", "block"]}
          />
          <Flex pt={[3, 5]} flexGrow={1} flexDirection="column">
            <Box text="text-sm" color="white" display={["none", "block"]}>
              Teleport
            </Box>
            <Box
              as="h1"
              mb={[9, "auto"]}
              pl={[3, 0]}
              pr={["120px", 6]}
              color="white"
              fontSize={["header-2", "header-1"]}
              fontWeight="regular"
            >
              {title}
            </Box>
            <Flex my={3} mr={[3, 7]} ml={[3, 0]} alignItems="center">
              <Scopes mr={[2, 3]} />
              <Versions {...versions} disabled={scope === "cloud"} />
              {!!githubUrl && (
                <Button
                  shape="md"
                  px="8px !important"
                  variant="secondary-white"
                  as="a"
                  href={githubUrl}
                  target="_blank"
                  ml="auto"
                  rel="noopener noreferrer"
                >
                  Improve
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Section>
  );
};

export default DocHeader;
