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
      theme === "dark" ? "#171c19" : "#f6f5ef"
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