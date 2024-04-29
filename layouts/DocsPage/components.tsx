import Admonition from "components/Admonition";
import Command, { CommandLine, CommandComment } from "components/Command";
import Icon from "components/Icon";
import Notice from "components/Notice";
import Snippet from "components/Snippet";
import { Tabs, TabItem } from "components/Tabs";
import { Var, VarList } from "components/Variables";
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
import { CodeLine } from "components/Code";

export const components = {
  a: Link,
  code: Code,
  inlineCode: Code,
  codeline: CodeLine,
  // eslint-disable-next-line jsx-a11y/alt-text
  img: (props) => <Image {...props} />, // needed to circumvent props mismatch in types
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
  commandline: CommandLine,
  commandcomment: CommandComment,
  icon: Icon,
  tabs: Tabs,
  tabitem: TabItem,
  figure: Figure,
  notice: Notice,
  snippet: Snippet,
  details: Details,
  var: (props) => <Var {...props} />, // needed to circumvent props mismatch in types
  varlist: VarList,
};
