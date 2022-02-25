// theme taken from https://github.com/highlightjs/highlight.js/blob/master/src/styles/monokai.css

import Box, { BoxProps } from "components/Box";

export type CodeProps = {
  children: React.ReactNode;
} & BoxProps;

export const Code = ({ children, ...props }: CodeProps) => {
  return (
    <Box
      as="pre"
      bg="code"
      display="block"
      overflowX="auto"
      m={0}
      px={3}
      py={2}
      color="#ddd"
      fontFamily="monospace"
      fontSize={["text-sm", "text-md"]}
      lineHeight="md"
      {...props}
      whiteSpace="pre"
      borderRadius="default"
      css={`
        & code {
          font-family: inherit;
        }

        & .hljs-tag,
        & .hljs-keyword,
        & .hljs-selector-tag,
        & .hljs-literal,
        & .hljs-strong,
        & .hljs-name {
          color: #f92672;
        }

        & .hljs-code {
          color: #66d9ef;
        }

        & .hljs-class .hljs-title {
          color: white;
        }

        & .hljs-attribute,
        & .hljs-symbol,
        & .hljs-regexp,
        & .hljs-link {
          color: #bf79db;
        }

        & .hljs-string,
        & .hljs-bullet,
        & .hljs-subst,
        & .hljs-title,
        & .hljs-section,
        & .hljs-emphasis,
        & .hljs-type,
        & .hljs-built_in,
        & .hljs-builtin-name,
        & .hljs-selector-attr,
        & .hljs-selector-pseudo,
        & .hljs-addition,
        & .hljs-variable,
        & .hljs-template-tag,
        & .hljs-template-variable {
          color: #a6e22e;
        }

        & .hljs-comment,
        & .hljs-quote,
        & .hljs-deletion,
        & .hljs-meta {
          color: #75715e;
        }

        & .hljs-keyword,
        & .hljs-selector-tag,
        & .hljs-literal,
        & .hljs-doctag,
        & .hljs-title,
        & .hljs-section,
        & .hljs-type,
        & .hljs-selector-id {
          font-weight: bold;
        }
      `}
    >
      {children}
    </Box>
  );
};
