import { program } from "commander";
import { loadConfig, defaultConfig, MinimumConfig } from "./config";

export async function parseArguments(): Promise<[MinimumConfig, string]> {
  program
    .version("0.1.0")
    .option("-o, --output <path>", "Output path")
    .option("-w, --width <number>", "Viewport width", parseInt)
    .option("-h, --height <number>", "Viewport height", parseInt)
    .option("-c, --config <path>", "Path to a config file")
    .argument("<url>", "URL to screenshot")
    .parse(process.argv);

  const url = program.args[0];

  const options = program.opts();

  let config = defaultConfig;
  if (options.config) {
    config = {
      ...config,
      ...(await loadConfig(options.config)),
    };
  }

  const {width, height, ...filteredOptions} = options;

  const finalOptions = {
    ...config,
    viewport: {
      ...config.viewport,
      width: options.width ?? config.viewport.width,
      height: options.height ?? config.viewport.height,
    },
    ...options
  };

  return [finalOptions, url];
}
