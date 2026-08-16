(function (root) {
  "use strict";

  const DEFAULT_LANG = "pt-BR";

  function githubAvatarUrl(username, size) {
    if (!username || typeof username !== "string") return "";
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return "";
    const px = Number(size) > 0 ? Number(size) : 240;
    return `https://github.com/${encodeURIComponent(clean)}.png?size=${px}`;
  }

  function pickLocalized(value, lang) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (typeof value !== "object") return "";
    const locale = lang || DEFAULT_LANG;
    const picked = value[locale] || value[DEFAULT_LANG] || value["en-IE"];
    return typeof picked === "string" ? picked : "";
  }

  function normalizeExperience(item, lang) {
    if (!item || typeof item !== "object") {
      return { title: "", company: "", period: "", description: "", current: false };
    }
    return {
      title: pickLocalized(item.role || item.title, lang),
      company: pickLocalized(item.company, lang),
      period: pickLocalized(item.period, lang),
      description: pickLocalized(item.description, lang),
      current: Boolean(item.current)
    };
  }

  function fromI18nList(list, lang) {
    if (!Array.isArray(list)) return [];
    return list.map((item) => normalizeExperience(item, lang));
  }

  function fromExperienceFile(payload, lang) {
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    return items.map((item) => normalizeExperience(item, lang));
  }

  function firstHeadline(live, dict) {
    if (live && typeof live.headline === "string" && live.headline.trim()) {
      return live.headline.trim();
    }
    return dict?.profile?.roleTag || "";
  }

  function build(options) {
    const config = options?.config || {};
    const dict = options?.dict || {};
    const live = options?.live || null;
    const experiencesPayload = options?.experiences || null;
    const lang = options?.lang || DEFAULT_LANG;
    const username = config.api?.githubUsername || "";
    const photoMode = config.profile?.photoSource || "auto";

    const livePhoto =
      live && typeof live.photoUrl === "string" ? live.photoUrl.trim() : "";
    const githubPhoto = githubAvatarUrl(username);
    const localPhoto =
      typeof config.profile?.photoUrl === "string"
        ? config.profile.photoUrl.trim()
        : "";

    let photoUrl = "";
    let photoOrigin = "none";

    if (photoMode === "none") {
      photoUrl = "";
    } else if (photoMode === "local") {
      photoUrl = localPhoto;
      photoOrigin = localPhoto ? "local" : "none";
    } else if (photoMode === "github") {
      photoUrl = githubPhoto;
      photoOrigin = githubPhoto ? "github" : "none";
    } else {
      if (livePhoto) {
        photoUrl = livePhoto;
        photoOrigin = live?.source || "live";
      } else if (githubPhoto) {
        photoUrl = githubPhoto;
        photoOrigin = "github";
      } else if (localPhoto) {
        photoUrl = localPhoto;
        photoOrigin = "local";
      }
    }

    const liveExperiences = fromExperienceFile(live?.experiences, lang).filter(
      (item) => item.title
    );
    const fileExperiences = fromExperienceFile(experiencesPayload, lang).filter(
      (item) => item.title
    );
    const i18nExperiences = fromI18nList(dict.experience, lang).filter(
      (item) => item.title
    );

    const experiences =
      liveExperiences.length > 0
        ? liveExperiences
        : fileExperiences.length > 0
          ? fileExperiences
          : i18nExperiences;

    return {
      name: (live && live.name) || config.profile?.name || "",
      headline: firstHeadline(live, dict),
      photoUrl,
      photoOrigin,
      source: live?.source || (fileExperiences.length ? "local" : "i18n"),
      updatedAt: live?.updatedAt || "",
      experiences
    };
  }

  const api = {
    githubAvatarUrl,
    pickLocalized,
    normalizeExperience,
    build
  };

  root.PortfolioProfile = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
