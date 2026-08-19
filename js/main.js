/* Click-to-enlarge lightbox for gallery + case-study images.
   Tiles that are links (<a class="tile">) navigate instead of enlarging. */
(function () {
  var groups = document.querySelectorAll(".gallery, .shots");
  if (!groups.length) return;

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

  groups.forEach(function (g) {
    g.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // linked tile -> let it navigate
      var item = e.target.closest(".tile, figure");
      if (!item) return;
      var img = item.querySelector("img");
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
