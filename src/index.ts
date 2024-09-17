import { Browser, Frame } from "puppeteer";
import puppeteer from "puppeteer";
import { isBlacklisted } from "./blacklist";
import { Blacklist } from "./config";
import { parseArguments } from "./cli";

async function captureIframeScreenshot(
  browser: Browser,
  url: string,
  width: number,
  height: number
): Promise<string> {
  const page = await browser.newPage();
  await page.setViewport({
    width: Math.round(width),
    height: Math.round(height),
  });
  console.log("Waiting for page to load...");
  await page.goto(url, { waitUntil: "networkidle0" });
  const screenshot = await page.screenshot({
    encoding: "base64",
    captureBeyondViewport: false,
  });
  await page.close();
  return screenshot;
}

async function replaceIframeWithScreenshot(
  frame: Frame,
  screenshot: string
): Promise<void> {
  const element = await frame.frameElement();
  if (element === null) throw "Failed to find frame element";
  await element.evaluate(
    (el: Element, screenshot: string) => {
      const img = document.createElement("img");
      img.src = `data:image/png;base64,${screenshot}`;
      el.parentNode!.replaceChild(img, el);
    },
    screenshot
  );
}

async function replaceWithScreenshot(
  frame: Frame,
  browser: Browser
) {
  const url = frame.url();
  console.log(`Replacing iframe for ${url}...`);
  const element = await frame.frameElement();
  if (element === null) throw "Failed to find frame element";
  const boundingBox = await element.boundingBox();
  if (boundingBox === null) throw "Failed to find frame dimensions";
  const screenshot = await captureIframeScreenshot(
    browser,
    url,
    boundingBox.width,
    boundingBox.height
  );
  await replaceIframeWithScreenshot(frame, screenshot);
}

async function replaceIframes(frame: Frame, browser: Browser, blacklist: Blacklist): Promise<void> {
  const childFrames = frame.childFrames();
  for (const childFrame of childFrames) {
    const url = childFrame.url();
    if (isBlacklisted(url, blacklist)) {
      console.log(`Skipping blacklisted iframe for ${url}`);
    } else {
      await replaceIframes(childFrame, browser, blacklist);
      await replaceWithScreenshot(childFrame, browser);
    }
  }
}

async function main(): Promise<void> {
  const [config, url] = await parseArguments()

  console.log("Launching browser...");
  const browser = await puppeteer.launch(config.launch);

  try {
    const page = await browser.newPage();

    await page.setViewport(config.viewport ?? null);

    console.log(`Going to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle0" });

    await replaceIframes(page.mainFrame(), browser, config.blacklist);

    const path = config.outputPath;

    await page.screenshot({
      path,
      fullPage: true,
      captureBeyondViewport: true,
    });

    console.log(`Screenshot saved to ${path}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

main();
