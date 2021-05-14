#! /usr/bin/env node

const { spawn } = require("child_process");

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  Invalid directory name.
  Usage: yarn create ts-boilerplate name-of-project
`);
}

const repoURL = "https://github.com/Capure/typescript-boilerplate";

runCommand("git", ["clone", repoURL, name])
  .then(() => {
    return process.platform === "win32"
      ? runCommand("rmdir", ["/s", "/q", `.\\${name}\\.git`], { shell: true })
      : runCommand("rm", ["-rf", `${name}/.git`]);
  })
  .then(() => {
    console.log("Installing dependencies...");
    return runCommand("yarn", ["install"], {
      cwd: process.cwd() + "/" + name,
      shell: process.platform === "win32",
    });
  })
  .then(() => {
    console.log("-----------------------------");
    console.log("Done! 🏁");
    console.log("");
    console.log("To get started:");
    console.log("cd", name);
    console.log("yarn dev");
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    spawned.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}
