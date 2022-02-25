import styled from "styled-components";
import css from "@styled-system/css";

export const P = styled("p")(
  css({
    mt: 0,
    mb: 3,
    fontSize: ["text-lg", "text-lg"],
    "&:last-child": {
      mb: 0,
    },
  })
);

export const UL = styled("ul")(
  css({
    mt: 0,
    mb: 3,
    pl: 4,
    "&:last-child": {
      mb: 0,
    },
  })
);

export const OL = styled("ol")(
  css({
    mt: 0,
    mb: 3,
    pl: 4,
    "&:last-child": {
      mb: 0,
    },
  })
);

export const LI = styled("li")(
  css({
    fontSize: ["text-lg", "text-lg"],
    mb: 2,
    "&:last-child": {
      mb: 0,
    },
  })
);

export const Table = styled("table")(
  css({
    display: ["block", "table"],
    mb: 4,
    bg: "white",
    boxShadow: "0 1px 4px rgba(0,0,0,.24)",
    borderRadius: "default",
    borderCollapse: "collapse",
    boxSizing: "border-box",
    width: "100%",
    overflow: "auto",
    whiteSpace: ["nowrap", "normal"],
    "&:last-child": {
      mb: 0,
    },
  })
);

export const THead = styled("thead")(
  css({
    borderBottom: "1px solid #D2DBDF",
  })
);

export const TBody = styled("tbody")(css({}));

export const TR = styled("tr")(
  css({
    "&:last-child": {
      borderBottomLeftRadius: "default",
      borderBottomRightRadius: "default",
    },
    [`${TBody} &:nth-child(even)`]: {
      bg: "lightest-gray",
    },
  })
);

export const TH = styled("th")(
  css({
    fontSize: ["text-md", "text-lg"],
    fontWeight: "bold",
    textAlign: "left",
    px: 3,
    py: 2,
  })
);

export const TD = styled("td")(
  css({
    fontSize: ["text-md", "text-lg"],
    lineHeight: "md",
    p: 3,
  })
);

export const Video = styled("video")(
  css({
    mb: 3,
    maxWidth: "100%",
    "&:last-child": {
      mb: 0,
    },
  })
);
