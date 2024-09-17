const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

// Function to wait for user input
function waitForKeyPress(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Prompt the user
    rl.question(`Press Enter to ${prompt ?? "continue"}...`, () => {
      rl.close();
      resolve();
    });
  });
}

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: true });

  // Open a new page
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to the page you want to capture
  await page.goto(
    "https://demo-festivals.flicket.io/events/ed509feb-27b0-4d70-b2c8-f658dd6407d4",
    { waitUntil: "networkidle0" }
  ); // Replace this with the desired URL

  console.log("Page loaded");

  //await waitForKeyPress("replace iframe");

  // Load the local image file and encode it to base64
  const imagePath = path.resolve("./iframe.png"); // Replace with your image path
  const imageBase64 = fs.readFileSync(imagePath, "base64");
  const imageSrc = `data:image/png;base64,${imageBase64}`;

  // await page.evaluate((imageSrc) => {
  //   const iframe = document.querySelector("#widget2"); // Find the iframe by its ID
  //   if (!iframe) {
  //     throw "No iframe found";
  //   }

  //   // Create an <img> element
  //   const img = document.createElement("img");
  //   img.src = imageSrc;

  //   // Set CSS styles to make the image fill the parent element
  //   img.style.width = "100%";
  //   img.style.height = "100%";
  //   img.style.objectFit = "cover"; // Optional: Adjust how the image scales (can use 'contain' or 'cover')

  //   // Replace the iframe with the new image
  //   iframe.parentNode.replaceChild(img, iframe);
  // }, imageSrc);

  // console.log("Replaced iframe with image");

  //await waitForKeyPress("take screenshot");

  // Scroll to the top of the page
  await page.evaluate(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  });

  // Take a full-page screenshot and save it
  await page.screenshot({
    path: "fullpage.png",
    fullPage: true,
    printBackground: true,
  });

  console.log("Taken screenshot");

  //await waitForKeyPress("exit");

  // Close the browser
  await browser.close();
})();
