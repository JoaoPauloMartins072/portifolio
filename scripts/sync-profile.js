#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const profile = require("../js/profile-source.js");

const ROOT = path.resolve(__dirname, "..");
const LIVE_PATH = path.join(ROOT, "data", "live.json");

function readConfig() {
  const code = fs.readFileSync(path.join(ROOT, "config.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window.PORTFOLIO_CONFIG || {};
}

async function fetchGithubUser(username) {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portifolio-profile-sync"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}`);
  }

  return response.json();
}

async function main() {
  const config = readConfig();
  const username = config.api?.githubUsername;
  const fallbackPhoto = profile.githubAvatarUrl(username);
  let live = {
    source: "github",
    updatedAt: new Date().toISOString(),
    name: config.profile?.name || "",
    photoUrl: fallbackPhoto,
    headline: "",
    experiences: []
  };

  if (username) {
    try {
      const user = await fetchGithubUser(username);
      live = {
        ...live,
        name: user.name || live.name,
        photoUrl: user.avatar_url || fallbackPhoto,
        githubBio: user.bio || "",
        githubUrl: user.html_url || ""
      };
    } catch (error) {
      live.syncError = String(error.message || error);
      console.warn("sync-profile: usando fallback da foto GitHub:", live.syncError);
    }
  }

  fs.mkdirSync(path.dirname(LIVE_PATH), { recursive: true });
  fs.writeFileSync(LIVE_PATH, `${JSON.stringify(live, null, 2)}\n`, "utf8");
  console.log(`sync-profile: gravou ${path.relative(ROOT, LIVE_PATH)} (${live.source})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
