import styled from "styled-components";
import css from "@styled-system/css";
import Box from "components/Box";

interface HeaderProps {
  id: string;
  children: React.ReactNode;
}

const StyledAnchor = styled("a")(
  css({
    display: "none",
    color: "light-gray",
    textDecoration: "none",
    "&:hover": {
      color: "gray",
    },
    "&:before": {
      content: '" \\B6"',
    },
  })
);

export const StyledHeader = styled(Box)(
  css({
    "& code": {
      fontSize: "0.875em",
    },
    [`&:hover ${StyledAnchor}`]: {
      display: "inline",
    },
    "&:first-child": {
      mt: 0,
    },
    "&:last-child": {
      mb: 0,
    },
  })
);

export const Header = ({ children, ...props }: HeaderProps) => {
  return (
    <StyledHeader {...props}>
      {children} <StyledAnchor href={`#${props.id}`} />
    </StyledHeader>
  );
};

export const H1 = (props) => (
  <Header
    as="h1"
    fontSize={["header-1", "section-heade"]}
    lineHeight={["xxl", "52px"]}
    fontWeight="black"
    mt={4}
    mb={3}
    {...props}
  />
);

export function H2(props) {
  return (
    <Header
      as="h2"
      fontSize={["header-2", "header-1"]}
      lineHeight={["lg", "xxl"]}
      fontWeight="bold"
      mt={3}
      mb={2}
      {...props}
    />
  );
}

export function H3(props) {
  return (
    <Header
      as="h3"
      fontSize={["header-4", "header-3"]}
      lineHeight={["md", "lg"]}
      fontWeight="bold"
      mt={3}
      mb={2}
      {...props}
    />
  );
}

export function H4(props) {
  return (
    <Header
      as="h4"
      fontSize="text-xl"
      lineHeight="lg"
      fontWeight="bold"
      mt={3}
      mb={2}
      {...props}
    />
  );
}

export function H5(props) {
  return (
    <Header
      as="h5"
      fontSize="text-md"
      lineHeight="lg"
      textTransform="uppercase"
      mt={3}
      mb={2}
      {...props}
    />
  );
}
