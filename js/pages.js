function fillSocialIds() {
  const social = window.PORTFOLIO_CONFIG?.social || {};
  const psn = document.getElementById("psn-id");
  const wildRift = document.getElementById("wild-rift-id");

  if (psn) psn.textContent = social.psnId || "Nao definido";
  if (wildRift) wildRift.textContent = social.wildRiftId || "Nao definido";
}

function fillExternalLinks() {
  const social = window.PORTFOLIO_CONFIG?.social || {};
  const contact = window.PORTFOLIO_CONFIG?.contact || {};

  const map = {
    "link-drummer": social.drummerInstagram,
    "link-photos": social.drummerInstagram,
    "link-dev-instagram": social.developerInstagram,
    "link-github": contact.github
  };

  Object.entries(map).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el && window.PortfolioSafe?.isSafeHttpUrl(href)) {
      el.href = href;
      el.rel = "noopener noreferrer";
    }
  });
}

function fillSpotifyEmbed() {
  const frame = document.getElementById("spotify-embed");
  const missing = document.getElementById("spotify-missing");
  if (!frame) return;

  const url = window.PORTFOLIO_CONFIG?.social?.spotifyUrl || "";
  const embed = window.PortfolioSpotify?.toSpotifyEmbed(url) || "";

  if (embed) {
    frame.src = embed;
    frame.hidden = false;
    if (missing) missing.hidden = true;
    return;
  }

  frame.removeAttribute("src");
  frame.hidden = true;
  if (missing) missing.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  fillSocialIds();
  fillExternalLinks();
  fillSpotifyEmbed();
});
