import React, { useContext, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  type InkeepAIChatSettings,
  type InkeepSearchSettings,
  type InkeepCustomTriggerProps,
  type InkeepWidgetBaseSettings,
  type AIChatFunctions,
  type SearchFunctions,
} from "@inkeep/widgets";

import { DocsContext } from "layouts/DocsPage/context";

import styles from "./InkeepSearch.module.css";
import InkeepSearchIconSvg from "./inkeepIcon.svg?react";
import { lato } from "../../pages/_app";

const API_KEY = process.env.NEXT_PUBLIC_INKEEP_API_KEY;
const INTEGRATION_ID = process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID;

const cssOverrides = `
  .inkeep-modal-widget-content {
    border: 2px solid #512FC9;
    border-radius: 12px;
    top: 88px;
    left: 12px;
  }
`;

const stylesheets = [<style key="inkeep-overrides">{cssOverrides}</style>];

const InkeepCustomTrigger = dynamic<InkeepCustomTriggerProps>(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepCustomTrigger),
  { ssr: false }
);

export function InkeepSearch() {
  const version = useContext(DocsContext).versions.current;
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const chatCallableFunctionsRef = useRef<AIChatFunctions | null>(null);
  const searchCallableFunctionsRef = useRef<SearchFunctions | null>(null);

  const handleChange = useCallback(
    (str: string) => {
      chatCallableFunctionsRef.current?.updateInputMessage(str);
      searchCallableFunctionsRef.current?.updateSearchQuery(str);
      setMessage(str);
      setIsOpen(true);
    },
    [setMessage, chatCallableFunctionsRef, searchCallableFunctionsRef]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const inkeepCustomTriggerProps: InkeepCustomTriggerProps = {
    isOpen,
    onClose: handleClose,
    stylesheets,
    baseSettings: {
      ...inkeepBaseSettings,
    },
    aiChatSettings: {
      ...inkeepAIChatSettings,
      chatFunctionsRef: chatCallableFunctionsRef,
      handleMessageChange: handleChange,
      // messageAttributes: {
      //   productVersion: version,
      // },
    },
    searchSettings: {
      ...inkeepSearchSettings,
      searchFunctionsRef: searchCallableFunctionsRef,
      handleSearchQueryChange: handleChange,
    },
    modalSettings: {
      closeOnBlur: true,
    },
  };

  return (
    <div>
      <div className={styles["search-input-wrapper"]}>
        <InkeepSearchIconSvg className={styles["inkeep-search-icon"]} />
        <input
          data-testid="search-input"
          type="text"
          className={styles["search-input"]}
          onChange={(e) => handleChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder="Search Docs"
          value={message}
        />
      </div>
      <InkeepCustomTrigger {...inkeepCustomTriggerProps} />
    </div>
  );
}

const inkeepBaseSettings: InkeepWidgetBaseSettings = {
  apiKey: API_KEY,
  integrationId: INTEGRATION_ID,
  organizationId: "teleport",
  organizationDisplayName: "Teleport",
  primaryBrandColor: "#512FC9",
  chatApiProxyDomain: "goteleport.com/inkeep-proxy",
  remoteErrorLogsLevel: 1,
  optOutAllAnalytics: true,
  consoleDebugLevel: 0,
  customCardSettings: [
    {
      filters: {
        ContentType: "docs",
      },
      searchTabLabel: "Docs",
      icon: { builtIn: "IoDocumentTextOutline" },
    },
  ],
  theme: {
    tokens: {
      fonts: {
        heading: lato?.style?.fontFamily,
        body: lato?.style?.fontFamily,
      },
      zIndex: {
        overlay: "2100",
        modal: "2200",
        popover: "2300",
        skipLink: "2400",
        toast: "2500",
        tooltip: "2600",
      },
    },
  },
};

const inkeepAIChatSettings: InkeepAIChatSettings = {
  botName: "Teleport",
  botAvatarSrcUrl: "https://goteleport.com/static/pam-standing.svg",
  isControlledMessage: true,
  defaultChatMode: "AUTO",
};

const inkeepSearchSettings: InkeepSearchSettings = {
  placeholder: "Search Docs",
  tabSettings: {
    isAllTabEnabled: false,
    rootBreadcrumbsToUseAsTabs: ["Docs", "GitHub"],
    tabOrderByLabel: ["Docs", "GitHub"],
    alwaysDisplayedTabs: ["Docs", "GitHub"],
    disabledDefaultTabs: undefined,
  },
  isControlledSearchQuery: true,
  shouldOpenLinksInNewTab: true,
};
