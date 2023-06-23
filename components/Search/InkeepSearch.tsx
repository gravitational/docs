import React, { useContext, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  InkeepModalProps,
  InkeepAIChatProps,
  InkeepWidgetBaseProps,
  InkeepSearchProps,
  InkeepModalWidgetProps,
  SearchCallableFunctions,
  AIChatCallableFunctions,
} from "@inkeep/inkeep-widget-library";

import { DocsContext } from "layouts/DocsPage/context";

import styles from "./InkeepSearch.module.css";
import InkeepSearchIconSvg from "./inkeepIcon.svg?react";

const API_KEY = process.env.NEXT_PUBLIC_INKEEP_API_KEY;
const INTEGRATION_ID = process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID;

const InkeepModalWidget = dynamic<InkeepModalWidgetProps>(
  () =>
    import("@inkeep/inkeep-widget-library").then(
      (mod) => mod.InkeepModalWidget
    ),
  { ssr: false }
);

export function InkeepSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const chatCallableFunctionsRef = useRef<AIChatCallableFunctions | null>(null);
  const searchCallableFunctionsRef = useRef<SearchCallableFunctions | null>(
    null
  );

  const handleChange = useCallback(
    (str: string) => {
      chatCallableFunctionsRef.current?.updateInputMessage(str);
      searchCallableFunctionsRef.current?.updateSearchQuery(str);
      setMessage(str);
    },
    [setMessage, chatCallableFunctionsRef, searchCallableFunctionsRef]
  );

  return (
    <div>
      <div className={styles["search-input-wrapper"]}>
        <InkeepSearchIconSvg className={styles["inkeep-search-icon"]} />
        <input
          data-testid="search-input"
          type="text"
          className={styles["search-input"]}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Docs"
          value={message}
        />
      </div>
      <InkeepWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        handleChange={handleChange}
        chatCallableFunctionsRef={chatCallableFunctionsRef}
        searchCallableFunctionsRef={searchCallableFunctionsRef}
      />
    </div>
  );
}

function InkeepWidget({
  chatCallableFunctionsRef,
  searchCallableFunctionsRef,
  handleChange,
  isOpen,
  onClose,
}: {
  chatCallableFunctionsRef: React.MutableRefObject<AIChatCallableFunctions>;
  searchCallableFunctionsRef: React.MutableRefObject<SearchCallableFunctions>;
  handleChange: (str: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const version = useContext(DocsContext).versions.current;

  const inkeepBaseSettings: InkeepWidgetBaseProps = {
    apiKey: API_KEY,
    integrationId: INTEGRATION_ID,
    organizationId: "teleport",
    organizationDisplayName: "Teleport",
    primaryBrandColor: "#512FC9",
    productVersion: version,
    product: "Teleport",
    publicSearchResultSources: ["DOCUMENTATION", "GITHUB_ISSUE"],
    inkeepMentionDecoratorText: "Powered by ",
    searchAndChatServiceProxyDomain: "goteleport.com/inkeep-proxy",
    remoteErrorLoggingLevel: 0,
    isOptedOutAllAnalytics: true,
    theme: {
      components: {
        InkeepWidgetModal: {
          ModalContent: {
            styles: {
              border: "2px solid #512FC9",
              borderRadius: "xl",
              top: "88px",
              left: "12px",
            },
          },
        },
      },
    },
  };

  const inkeepAIChatSettings: InkeepAIChatProps = {
    botName: "Teleport",
    defaultChatMode: "TURBO",
    isChatModeToggleEnabled: true,
    isDisclaimerEnabled: false,
    chatCallableFunctionsRef: chatCallableFunctionsRef,
    handleMessageChange: handleChange,
    isControlledMessage: true,
  };

  const inkeepSearchSettings: InkeepSearchProps = {
    placeholder: "Search Docs",
    searchCallableFunctionsRef: searchCallableFunctionsRef,
    handleSearchQueryChange: handleChange,
    isControlledSearchQuery: true,
    shouldOpenLinksInNewTab: false,
    isAggregateResultsTabEnabled: false,
  };

  const inkeepModalSettings: InkeepModalProps = {
    isOpen,
    onClose,
  };

  const inkeepModalWidgetProps: InkeepModalWidgetProps = {
    ...inkeepModalSettings,
    baseSettings: { ...inkeepBaseSettings },
    aiChatSettings: { ...inkeepAIChatSettings },
    searchSettings: { ...inkeepSearchSettings },
  };

  return <InkeepModalWidget {...inkeepModalWidgetProps} />;
}
