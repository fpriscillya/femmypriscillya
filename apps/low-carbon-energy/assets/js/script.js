$(function () {
  /* ======================
     SETTINGS (Quantitative)
  ====================== */
  //// Based on Swiss Federal Office of Energy, Electricity Statistics 2023
  // https://www.newsd.admin.ch/newsd/message/attachments/87085.pdf

  const TARGET = 56.1; // Switzerland electricity use (TWh/year)

  const ENERGY = {
    // 1 icon = 1 GW installed capacity (TWh/year = 8.76 * CF)
    nuclear: {
      twh: 7.3, // 1 GW * 8.76 * 0.83
      label: "1 nuclear icon = 1 GW nuclear (~83% CF) ≈ 7.3 TWh/year.",
    },
    geothermal: {
      twh: 5.7, // 1 GW * 8.76 * 0.646
      label:
        "1 geothermal icon = 1 GW geothermal (high-utilisation) ≈ 5.7 TWh/year.",
    },
    biomass: {
      twh: 4.3, // 1 GW * 8.76 * 0.49
      label: "1 biomass icon = 1 GW biomass (dispatchable) ≈ 4.3 TWh/year.",
    },
    hydro: {
      twh: 2.6, // 1 GW * 8.76 * 0.295
      label:
        "1 hydropower icon = 1 GW hydro (Europe avg utilisation) ≈ 2.6 TWh/year.",
    },
    wind: {
      twh: 2.2, // 1 GW * 8.76 * ~0.248
      label: "1 wind icon = 1 GW wind (EU fleet avg) ≈ 2.2 TWh/year.",
    },
    solar: {
      twh: 0.9, // 1 GW * 8.76 * ~0.101 (Swiss avg yield)
      label: "1 solar icon = 1 GW solar PV (Swiss avg yield) ≈ 0.9 TWh/year.",
    },
  };

  /* ======================
     APP STATE
  ====================== */
  let total = 0;
  let targetReached = false;
  let hasStarted = false;

  const counts = {
    nuclear: 0,
    geothermal: 0,
    wind: 0,
    solar: 0,
    hydro: 0,
    biomass: 0,
  };

  /* ======================
     FOX GUIDE (Dialogs in HTML)
  ====================== */
  let foxVisible = false;

  // flip flag: alternates qualitative1 / qualitative2 each time qualitative tech is clicked
  let qualitativeFoxFlip = false;

  function showFoxFromHTML(key) {
    const html = $(`#fox-dialogs [data-fox="${key}"]`).html();
    if (!html) return; // safety: prevents errors if missing key
    $("#fox-message").html(html);
    $("#fox-bubble").removeClass("hidden");
    foxVisible = true;
  }

  function hideFox() {
    $("#fox-bubble").addClass("hidden");
    foxVisible = false;
  }

  // user clicks fox: toggle bubble
  $("#fox-avatar").on("click", function () {
    foxVisible ? hideFox() : showFoxFromHTML("intro");
  });

  /* ======================
     MODAL
  ====================== */
  function showModal(message) {
    $("#modal-message").html(message);
    $("#modal-overlay").removeClass("hidden");
  }

  function closeModal() {
    $("#modal-overlay").addClass("hidden");
  }

  $("#modal-close").on("click", closeModal);

  // Click outside modal box closes it
  $("#modal-overlay").on("click", function (e) {
    if (e.target === e.currentTarget) closeModal();
  });

  // ESC closes modal
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ======================
     DRAG & DROP (Quantitative)
  ====================== */
  $(".energy-icon").draggable({
    helper: "clone",
    revert: "invalid",
  });

  $(".drop-slot").droppable({
    // accept ONLY the matching type (each tech into its own slot)
    accept: function (draggable) {
      return draggable.data("type") === $(this).data("type");
    },
    tolerance: "pointer",

    drop: function (e, ui) {
      const type = ui.draggable.data("type");
      if (!ENERGY[type]) return;

      // Add mini icon
      $(this)
        .find(".slot-content")
        .append(ui.draggable.find("img").clone().addClass("mini-icon"));

      // Update state
      counts[type]++;
      total += ENERGY[type].twh;

      // Fox: first interaction
      if (!hasStarted) {
        hasStarted = true;
        showFoxFromHTML("first-drag");
      }

      // Fox: nuclear first time
      if (type === "nuclear" && counts.nuclear === 1) {
        showFoxFromHTML("nuclear-first");
      }

      // Fox: many wind/solar (example threshold)
      if ((type === "solar" || type === "wind") && counts[type] === 4) {
        showFoxFromHTML("many-renewables");
      }

      // Fox: diversity of sources
      const usedTechCount = Object.values(counts).filter((v) => v > 0).length;
      if (usedTechCount === 4) {
        showFoxFromHTML("diversity");
      }

      // Fox: many of same tech
      const SAME_TECH_THRESHOLD = 5;
      if (counts[type] === SAME_TECH_THRESHOLD) {
        showFoxFromHTML("many-same-tech");
      }

      // Update UI
      updateCounts();
      updateExplanation(type);

      // Target reached
      if (!targetReached && total >= TARGET) {
        targetReached = true;

        showModal(`
          <strong>Target reached!</strong><br><br>
          Your mix produces <strong>${total.toFixed(1)} TWh/year</strong>,
          matching Switzerland’s annual demand (≈ ${TARGET} TWh/year).
        `);

        showFoxFromHTML("target-reached");
      }
    },
  });

  function updateCounts() {
    const labels = {
      nuclear: "Nuclear",
      geothermal: "Geothermal",
      wind: "Wind",
      solar: "Solar",
      hydro: "Hydropower",
      biomass: "Biomass",
    };

    $("#energy-counts").html(
      Object.keys(counts)
        .filter((k) => counts[k] > 0)
        .map((k) => `<li>${counts[k]} × ${labels[k]}</li>`)
        .join("")
    );
  }

  function updateExplanation(type) {
    $("#explanation").html(`
      <strong>Last added:</strong> ${type.toUpperCase()}<br>
      ${ENERGY[type].label}<br><br>
      <strong>Total:</strong> ${total.toFixed(1)} / ${TARGET} TWh/year
    `);
  }

  $("#reset").on("click", function () {
    // reset quantitative
    total = 0;
    targetReached = false;
    hasStarted = false;

    Object.keys(counts).forEach((k) => (counts[k] = 0));
    $(".slot-content").empty();
    $("#energy-counts").empty();
    $("#explanation").empty();

    closeModal();
    hideFox();

    // reset qualitative flip so it starts again from qualitative1
    qualitativeFoxFlip = false;

    // reset qualitative UI
    resetQualitative();
  });

  /* ======================
     QUALITATIVE EXPLORER
  ====================== */
  const IMPACT = {
    nuclear: {
      intermittency: 5,
      land: 20,
      minerals: 45,
      acceptance: 80,
      waste: 90,
    },
    solar: {
      intermittency: 85,
      land: 80,
      minerals: 75,
      acceptance: 30,
      waste: 40,
    },
    wind: {
      intermittency: 75,
      land: 35,
      minerals: 55,
      acceptance: 55,
      waste: 35,
    },
    geothermal: {
      intermittency: 10,
      land: 25,
      minerals: 35,
      acceptance: 75,
      waste: 45,
    },
    hydro: {
      intermittency: 35,
      land: 70,
      minerals: 30,
      acceptance: 55,
      waste: 30,
    },
    biomass: {
      intermittency: 25,
      land: 85,
      minerals: 20,
      acceptance: 55,
      waste: 70,
    },
  };

  let active = null;

  const PLACEHOLDER_HTML =
    '<p class="placeholder">Click a technology above to read what it’s good at, and what makes it difficult.</p>';

  function resetQualitative() {
    active = null;
    $(".impact-icon").removeClass("active");
    $("#indicator-title").text("Select a technology");
    $(".bar > div").css("width", "0%");
    $("#indicator-explanation").html(PLACEHOLDER_HTML);
  }

  // start clean
  resetQualitative();

  $(".impact-icon").on("click", function () {
    const type = $(this).data("type");
    if (!IMPACT[type]) return;

    // toggle off if clicking same type
    if (active === type) {
      resetQualitative();
      hideFox();
      return;
    }

    active = type;
    $(".impact-icon").removeClass("active");
    $(this).addClass("active");

    $("#indicator-title").text(type.toUpperCase());

    // update bars
    Object.entries(IMPACT[type]).forEach(([k, v]) => {
      $(`#bar-${k}`).css("width", v + "%");
    });

    // update explanation (pulled from HTML)
    const expHtml = $(`#impact-explanations [data-type="${type}"]`).html();
    $("#indicator-explanation").html(expHtml || PLACEHOLDER_HTML);

    // FOX: alternate the qualitative messages every time
    qualitativeFoxFlip = !qualitativeFoxFlip;
    showFoxFromHTML(qualitativeFoxFlip ? "qualitative-2" : "qualitative-1");
  });
});
