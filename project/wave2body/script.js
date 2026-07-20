(() => {
  const scrollButton = document.getElementById("scroll-to-top");
  const copyButton = document.getElementById("copy-bibtex");
  const copyStatus = document.getElementById("copy-status");

  const updateScrollButton = () => {
    if (!scrollButton) return;
    scrollButton.classList.toggle("is-visible", window.scrollY > 420);
  };

  if (scrollButton) {
    updateScrollButton();
    window.addEventListener("scroll", updateScrollButton, { passive: true });
    scrollButton.addEventListener("click", () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Copy command failed");
  };

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const targetId = copyButton.dataset.copyTarget;
      const target = targetId ? document.getElementById(targetId) : null;
      const label = copyButton.querySelector(".copy-label");
      if (!target || !label) return;

      try {
        const text = target.textContent.trim();
        let copied = false;

        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(text);
            copied = true;
          } catch (error) {
            copied = false;
          }
        }

        if (!copied) {
          fallbackCopy(text);
        }

        copyButton.classList.add("is-copied");
        label.textContent = "Copied";
        if (copyStatus) copyStatus.textContent = "BibTeX copied to clipboard.";

        window.setTimeout(() => {
          copyButton.classList.remove("is-copied");
          label.textContent = "Copy";
          if (copyStatus) copyStatus.textContent = "";
        }, 2200);
      } catch (error) {
        if (copyStatus) copyStatus.textContent = "Copy failed. Select the citation text manually.";
      }
    });
  }
})();
