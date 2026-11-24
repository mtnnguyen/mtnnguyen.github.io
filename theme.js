(() => {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");

  function readPreference() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  let preference = readPreference();

  function applyTheme(theme) {
    root.dataset.theme = theme;

    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#1a1b1a" : "#f4f5f2"
    );

    const button = document.getElementById("theme-toggle");
    if (button) {
      const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
      button.setAttribute("aria-label", label);
      button.title = label;
    }
  }

  function resolveTheme() {
    return preference || (systemTheme.matches ? "dark" : "light");
  }

  applyTheme(resolveTheme());

  // Pack-opening intro: plays once per visit. Hide the page until app.js takes over,
  // with a safety timeout so the page can never stay hidden.
  try {
    if (!sessionStorage.getItem("pack-opened") && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("pack-pending");
      setTimeout(() => root.classList.remove("pack-pending"), 4000);
    }
  } catch {}

  systemTheme.addEventListener("change", () => {
    if (!preference) applyTheme(resolveTheme());
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = readPreference();
    applyTheme(resolveTheme());
  });

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    applyTheme(resolveTheme());

    button.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";

      try {
        localStorage.setItem(storageKey, preference);
      } catch {}

      applyTheme(preference);
    });

    button.hidden = false;
  });
})();