import * as readline from "readline";

export function waitForKeyPress(nextAction?: string): Promise<void> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`Press Enter to ${nextAction ?? "continue"}...`, () => {
      rl.close();
      resolve();
    });
  });
}