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

  const api = { escapeHtml, isSafeHttpUrl, isSafeGithubUrl, isSafeEmail };
  root.PortfolioSafe = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
