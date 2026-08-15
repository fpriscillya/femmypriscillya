/* Click-to-enlarge lightbox for gallery images. */
(function () {
  var galleries = document.querySelectorAll(".gallery");
  if (!galleries.length) return;
  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML =
    '<button class="close" aria-label="Close">&times;</button><img alt="" /><div class="cap"></div>';
  document.body.appendChild(box);
  var bigImg = box.querySelector("img"),
    cap = box.querySelector(".cap"),
    closeBtn = box.querySelector(".close");
  function open(src, alt) {
    bigImg.src = src;
    bigImg.alt = alt || "";
    cap.textContent = alt || "";
    box.classList.add("open");
    closeBtn.focus();
  }
  function close() {
    box.classList.remove("open");
    bigImg.src = "";
  }
  galleries.forEach(function (g) {
    g.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var tile = e.target.closest(".tile, figure");
      if (!tile) return;
      var img = tile.querySelector("img");
      if (!img) return;
      open(img.currentSrc || img.src, img.alt);
    });
  });
  closeBtn.addEventListener("click", close);
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });
})();
