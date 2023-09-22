import { getPathWithoutVersion } from "./url";

const agnost = ["preview/upcoming-releases/", "changelog/"];

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
