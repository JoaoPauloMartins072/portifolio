(function (root) {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isSafeHttpUrl(url) {
    if (!url || typeof url !== "string") return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (_error) {
      return false;
    }
  }

  function isSafeGithubUrl(url) {
    if (!isSafeHttpUrl(url)) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && parsed.hostname === "github.com";
    } catch (_error) {
      return false;
    }
  }

  function isSafeEmail(email) {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isAllowedImageHost(hostname) {
    const host = String(hostname || "").toLowerCase();
    const exact = new Set([
      "github.com",
      "www.github.com",
      "avatars.githubusercontent.com",
      "media.licdn.com",
      "instagram.com",
      "www.instagram.com"
    ]);
    if (exact.has(host)) return true;
    if (host.endsWith(".licdn.com")) return true;
    if (host.endsWith(".cdninstagram.com")) return true;
    return false;
  }

  function isSafeImageUrl(url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("./") || url.startsWith("/")) {
      return !url.includes("..") && !url.includes("//") && !url.includes("\\");
    }
    if (!isSafeHttpUrl(url)) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && isAllowedImageHost(parsed.hostname);
    } catch (_error) {
      return false;
    }
  }

  const api = {
    escapeHtml,
    isSafeHttpUrl,
    isSafeGithubUrl,
    isSafeEmail,
    isSafeImageUrl
  };
  root.PortfolioSafe = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
