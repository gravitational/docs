import Admonition from "components/Admonition";
import Command, { CommandLine, CommandComment } from "components/Command";
import BaseLink from "components/Link";
import Notice from "components/Notice";
import ScopedBlock from "components/ScopedBlock";
import Snippet from "components/Snippet";
import { Tabs, TabItem } from "components/Tabs";
import {
  Tile,
  TileSet,
  TileList,
  TileListItem,
  TileImage,
} from "components/Tile";
import Details from "components/Details";
import {
  Code,
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  UL,
  OL,
  LI,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Video,
  Image,
  Figure,
  IFrame,
  Pre,
} from "components/MDX";

export const components = {
  a: function Link(props) {
    return <BaseLink {...props} scheme="docs" />;
  },
  code: Code,
  inlineCode: Code,
  img: Image,
  iframe: IFrame,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  p: P,
  pre: Pre,
  ul: UL,
  ol: OL,
  li: LI,
  table: Table,
  thead: THead,
  tbody: TBody,
  tr: TR,
  th: TH,
  td: TD,
  video: Video,
  Admonition,
  Command,
  CommandLine,
  CommandComment,
  ScopedBlock,
  Tabs,
  TabItem,
  Tile,
  TileSet,
  TileList,
  TileListItem,
  TileImage,
  Figure,
  Notice,
  Snippet,
  Details,
};
