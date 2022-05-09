import Admonition from "components/Admonition";
import Command, { CommandLine, CommandComment } from "components/Command";
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
  Link,
  Table,
  THead,
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
  a: Link,
  code: Code,
  inlineCode: Code,
  // eslint-disable-next-line jsx-a11y/alt-text
  //img: (props) => <Image {...props} />,
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
  tr: TR,
  th: TH,
  td: TD,
  video: Video,
  admonition: Admonition,
  command: Command,
  "command-line": CommandLine,
  "command-comment": CommandComment,
  "scoped-block": ScopedBlock,
  tabs: Tabs,
  "tab-item": TabItem,
  tile: Tile,
  "tile-set": TileSet,
  "tile-list": TileList,
  "tile-list-item": TileListItem,
  "tile-image": TileImage,
  //figure: Figure,
  notice: Notice,
  snippet: Snippet,
  details: Details,
};
