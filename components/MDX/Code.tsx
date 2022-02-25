import Box from "components/Box";

const isHLJSNode = ({ className }) =>
  Boolean(className) && className.indexOf("hljs") !== -1;

const Code = (props) => {
  if (isHLJSNode(props)) {
    return <code {...props} />;
  }

  return (
    <Box
      as="code"
      {...props}
      px={1}
      bg="lightest-gray"
      border="1px solid"
      borderColor="light-gray"
      borderRadius="sm"
      fontSize="text-md"
      wordBreak="break-word"
    />
  );
};

export default Code;
