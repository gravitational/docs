"use client";

const INKEEP_API_KEY = "b4a9d9f13d7d1540b8b200a2a3374353ec50b068a9bf9bd0";
const INKEEP_INTEGRATION_ID = "88e39f4c03457df277d83807";
const INKEEP_ORGANIZATION_ID = "teleport";

// Get the Mintlify search containers, going to reuse them as the triggers for Inkeep
const searchButtonContainerIds = [
  "search-bar-entry",
  "search-bar-entry-mobile",
];

// Clone and replace, needed to remove existing event listeners
const clonedSearchButtonContainers = searchButtonContainerIds.map((id) => {
  const originalElement = document.getElementById(id);
  const clonedElement = originalElement.cloneNode(true);
  originalElement.parentNode.replaceChild(clonedElement, originalElement);
  return clonedElement;
});

// Load the Inkeep script
const inkeepScript = document.createElement("script");
inkeepScript.type = "module";
inkeepScript.src =
  "https://unpkg.com/@inkeep/widgets-embed@0.2.260/dist/embed.js";
document.body.appendChild(inkeepScript);
// Once the Inkeep script has loaded, load the Inkeep chat components
inkeepScript.addEventListener("load", function () {
  // Customization settings
  const sharedConfig = {
    baseSettings: {
      apiKey: INKEEP_API_KEY,
      integrationId: INKEEP_INTEGRATION_ID,
      organizationId: INKEEP_ORGANIZATION_ID,
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
    },
    aiChatSettings: {
      botName: "Teleport",
      botAvatarSrcUrl: "https://goteleport.com/static/pam-standing.svg",
      isControlledMessage: true,
      defaultChatMode: "AUTO",
    },
    searchSettings: {
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
    },
    modalSettings: {
      closeOnBlur: true,
    },
  };

  // for syncing with dark mode
  const colorModeSettings = {
    observedElement: document.documentElement,
    isDarkModeCallback: (el) => {
      return el.classList.contains("dark");
    },
    colorModeAttribute: "class",
  };
  // add the "Ask AI" pill chat button
  Inkeep().embed({
    componentType: "ChatButton",
    colorModeSync: colorModeSettings,
    properties: sharedConfig,
  });
  // instantiate Inkeep "custom trigger" component
  const inkeepSearchModal = Inkeep({
    ...sharedConfig.baseSettings,
  }).embed({
    componentType: "CustomTrigger",
    colorModeSync: colorModeSettings,
    properties: {
      ...sharedConfig,
      isOpen: false,
      onClose: () => {
        inkeepSearchModal.render({
          isOpen: false,
        });
      },
    },
  });
  // When the Mintlify search bar clone is clicked, open the Inkeep search modal
  clonedSearchButtonContainers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      inkeepSearchModal.render({
        isOpen: true,
      });
    });
  });
});
