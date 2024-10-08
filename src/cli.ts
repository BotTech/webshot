import { InvalidArgumentError, program } from "commander";
import { loadConfig, defaultConfig, MinimumConfig } from "./config";

function myParseInt(value: string) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

export async function parseArguments(): Promise<[MinimumConfig, string]> {
  program
    .description("Takes a screenshot of a webpage including any pesky iframes with cross origin content.")
    .version("0.1.2")
    .option("-o, --output <path>", "Output file path.", "screenshot.png")
    .option("-w, --width <number>", "Viewport width.", myParseInt, 1920)
    .option("-h, --height <number>", "Viewport height.", myParseInt, 1080)
    .option("-c, --config <path>", "Path to a config file.")
    .argument("<url>", "URL of the page to screenshot.")
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
