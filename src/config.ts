import { promises as fs } from "fs";
import { PuppeteerLaunchOptions, Viewport } from "puppeteer";
import defaultConfigDefault from "../default-config";

const defaultConfig = defaultConfigDefault as MinimumConfig
export { defaultConfig }

export type BlacklistItem = {
  domain: string;
  path?: string;
};

export type Blacklist = BlacklistItem[];

export type Config = {
  blacklist?: Blacklist;
  outputPath?: string;
  viewport?: Viewport;
  launch?: PuppeteerLaunchOptions;
};

export type MinimumConfig = Config & {
  blacklist: Blacklist;
  outputPath: string;
  viewport: Viewport;
  launch?: PuppeteerLaunchOptions;
}

export async function loadConfig(path: string): Promise<Config> {
  const data = await fs.readFile(path, "utf8");
  return JSON.parse(data);
}
