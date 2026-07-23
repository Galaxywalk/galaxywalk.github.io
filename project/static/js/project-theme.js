(() => {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const lightThemeColor = themeMeta ? themeMeta.getAttribute("content") : "#ffffff";

  const readPreference = () => {
    try {
      const value = localStorage.getItem("theme");
      return value === "dark" || value === "light" || value === "system"
        ? value
        : "system";
    } catch (error) {
      return "system";
    }
  };

  const writePreference = (value) => {
    try {
      localStorage.setItem("theme", value);
    } catch (error) {
      // Theme switching still works for this page if storage is unavailable.
    }
  };

  const resolveTheme = (preference) => {
    if (preference === "dark" || preference === "light") return preference;
    return media.matches ? "dark" : "light";
  };

  const updateButton = (theme) => {
    const button = document.getElementById("project-theme-toggle");
    if (!button) return;

    const nextTheme = theme === "dark" ? "light" : "dark";
    const label = `Switch to ${nextTheme} theme`;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.querySelector(".project-theme-toggle__icon").textContent =
      theme === "dark" ? "☾" : "☀";
  };

  const applyTheme = (preference = readPreference()) => {
    const theme = resolveTheme(preference);
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        theme === "dark" ? "#0f1724" : lightThemeColor
      );
    }
    updateButton(theme);
    return theme;
  };

  applyTheme();

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.createElement("button");
    button.id = "project-theme-toggle";
    button.className = "project-theme-toggle";
    button.type = "button";
    button.innerHTML =
      '<span class="project-theme-toggle__icon" aria-hidden="true"></span>';
    document.body.appendChild(button);

    applyTheme();
    button.addEventListener("click", () => {
      const nextTheme = root.hasAttribute("data-theme") ? "light" : "dark";
      writePreference(nextTheme);
      applyTheme(nextTheme);
    });
  });

  media.addEventListener("change", () => {
    if (readPreference() === "system") applyTheme("system");
  });
})();
