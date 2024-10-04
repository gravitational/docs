import React, { useState, useRef, useCallback, useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useDocsVersion } from "@docusaurus/theme-common/internal";
import {
  type InkeepAIChatSettings,
  type InkeepSearchSettings,
  type InkeepCustomTriggerProps,
  type InkeepWidgetBaseSettings,
  type AIChatFunctions,
  type SearchFunctions,
} from "@inkeep/widgets";

import styles from "./InkeepSearch.module.css";
import InkeepSearchIconSvg from "./inkeepIcon.svg";

const cssOverrides = `
  .ikp-modal-widget-content {
    border: 2px solid #512FC9;
    border-radius: 12px;
    top: 88px;
    left: 12px;
  }
`;

const stylesheets = [<style key="inkeep-overrides">{cssOverrides}</style>];

export function InkeepSearch() {
  const versionMetadata = useDocsVersion();
  const { version } = versionMetadata;
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [CustomTrigger, setCustomTrigger] = useState(null);

  useEffect(() => {
    (async () => {
      const { InkeepCustomTrigger } = await import("@inkeep/widgets");
      setCustomTrigger(() => InkeepCustomTrigger);
    })();
  }, []);

  const { siteConfig } = useDocusaurusContext();

  const innkeepConfig = siteConfig.customFields.innkeepConfig as {
    apiKey: string;
    integrationId: string;
    organizationId: string;
  };

  const inkeepBaseSettings: InkeepWidgetBaseSettings = {
    apiKey: innkeepConfig.apiKey,
    integrationId: innkeepConfig.integrationId,
    organizationId: innkeepConfig.organizationId,
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
      colorMode: {
        forcedColorMode: "light",
      },
      tokens: {
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
      messageAttributes: {
        productVersion: version,
      },
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
      <div className={styles.wrapper}>
        <InkeepSearchIconSvg className={styles.icon} />
        <input
          type="text"
          className={styles.input}
          onChange={(e) => handleChange(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder="Search Docs"
          value={message}
        />
      </div>
      <BrowserOnly fallback={<div />}>
        {() => {
          return (
            CustomTrigger && <CustomTrigger {...inkeepCustomTriggerProps} />
          );
        }}
      </BrowserOnly>
    </div>
  );
}

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
