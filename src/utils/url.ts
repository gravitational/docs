interface URLParts {
  anchor?: string;
  path: string;
  query: Record<string, string>;
}

export const splitPath = (fullPath: string): URLParts => {
  const [rest, anchor] = fullPath.split("#");
  const [path, search] = rest.split("?");
  const query: Record<string, string> = !search
    ? {}
    : search.split("&").reduce((result, segment) => {
        const [key, value] = segment.split("=");

        result[key] = value;

        return result;
      }, {});

  return { anchor, path, query };
};

export const buildPath = (parts: URLParts): string => {
  let result = parts.path;

  const search = Object.entries(parts.query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  if (search) {
    result = `${result}?${search}`;
  }

  if (parts.anchor) {
    result = `${result}#${parts.anchor}`;
  }

  return result;
};

export const getExtension = (href: string): string | undefined => {
  const parts = href.split("/");
  const filename = parts[parts.length - 1];

  if (filename.indexOf(".") !== -1) {
    // should catch double extensions like `.tag.gz` and `.gitignore`
    const result = /[^.]*\.(.+)/.exec(filename);

    return result ? result[1] : undefined;
  }
};

export const isRelativePath = (path: string): boolean =>
  /^\.{1,2}\//.test(path);

export const isExternalLink = (href: string): boolean =>
  href.startsWith("//") || href.startsWith("mailto:") || href.includes("://");

export const isHash = (href: string): boolean => href.startsWith("#");

export const isMdxLink = (href: string): boolean => /\.md(x)?(#|$)/.test(href);

export const isPage = (href: string): boolean =>
  isMdxLink(href) || !getExtension(href);

interface IsLocalAssetFileProps {
  extWhiteList?: string[];
  extBlackList?: string[];
}

export const isLocalAssetFile = (
  href: unknown,
  options: IsLocalAssetFileProps = {}
) => {
  if (typeof href !== "string") {
    return false;
  }

  const { extWhiteList = [], extBlackList = [] } = options;

  const { path } = splitPath(href);
  const ext = getExtension(path);

  return (
    !isExternalLink(path) &&
    !path.startsWith("/") &&
    !!ext &&
    (extBlackList.length ? !extBlackList.includes(ext) : false) &&
    (extWhiteList.length ? extWhiteList.includes(ext) : true)
  );
};

export const getPathWithoutVersion = (route: string) => {
  const path = splitPath(route).path;
  return path.startsWith("/ver/")
    ? path.split("/").slice(3).join("/")
    : path.slice(1);
};

export const getAnchor = (route: string): string => {
  return route.split("#")[1] || "";
};
