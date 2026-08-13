(function (root) {
  "use strict";

  const ALLOWED_TYPES = {
    playlist: true,
    album: true,
    track: true,
    artist: true,
    episode: true,
    show: true
  };

  function toSpotifyEmbed(url) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";

    if (/^https:\/\/open\.spotify\.com\/embed\//.test(trimmed)) {
      return trimmed;
    }

    const uriMatch = trimmed.match(
      /^spotify:(playlist|album|track|artist|episode|show):([A-Za-z0-9]+)$/
    );
    if (uriMatch) {
      return `https://open.spotify.com/embed/${uriMatch[1]}/${uriMatch[2]}?utm_source=generator`;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname !== "open.spotify.com") return "";

      const parts = parsed.pathname.split("/").filter(Boolean);
      let type;
      let id;

      if (parts[0] && parts[0].startsWith("intl-") && parts.length >= 3) {
        type = parts[1];
        id = parts[2];
      } else {
        type = parts[0];
        id = parts[1];
      }

      if (!ALLOWED_TYPES[type] || !id) return "";
      id = id.split("?")[0];
      if (!/^[A-Za-z0-9]+$/.test(id)) return "";

      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
    } catch (_error) {
      return "";
    }
  }

  const api = { toSpotifyEmbed };
  root.PortfolioSpotify = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
