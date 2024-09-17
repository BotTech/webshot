import { Blacklist, BlacklistItem } from "./config";

function matchesBlacklist(url: URL, blacklist: BlacklistItem): boolean {
  function matchesDomain(): boolean {
    const domain = url.hostname;
    return (
      domain === blacklist.domain || domain.endsWith(`.${blacklist.domain}`)
    );
  }
  function matchesPath(): boolean {
    const path = url.pathname;
    return blacklist.path === undefined || path.startsWith(blacklist.path);
  }
  return matchesDomain() && matchesPath();
}

export function isBlacklisted(url: string, blacklist: Blacklist): boolean {
  if (url === '' || url === "about:blank") return true;
  const parsed = new URL(url);
  return (
    blacklist.find((black) => matchesBlacklist(parsed, black)) !== undefined
  );
}