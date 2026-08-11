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
    if (el && href) {
      el.href = href;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fillSocialIds();
  fillExternalLinks();
});
