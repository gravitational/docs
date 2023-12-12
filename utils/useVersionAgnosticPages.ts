import { getPathWithoutVersion } from "./url";

// Paths including these segments are version agnostic. If a URL path includes
// one of these segments when a user visits a page via a navigation link:
// - The docs site will render the default version of the page
// - The version switcher will be disabled on the page
const agnost = [
  "upcoming-releases/",
  "changelog/",
  "contributing/documentation/",
  "contributing/documentation/reviewing-docs/",
  "contributing/documentation/issues/",
  "contributing/documentation/style-guide/",
  "contributing/documentation/reference/",
  "contributing/documentation/how-to-contribute/",
];

export const useVersionAgnosticPages = () => {
  const isVersionAgnosticPage = (route: string) => {
    const path = getPathWithoutVersion(route);
    return agnost.includes(path);
  };

  const getVersionAgnosticRoute = (route: string) => {
    if (isVersionAgnosticPage(route)) {
      return `/${getPathWithoutVersion(route)}`;
    }
    return route;
  };

  return {
    isVersionAgnosticPage,
    getVersionAgnosticRoute,
  };
};
