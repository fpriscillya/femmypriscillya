//===============================================================
// 1. SELECT MAIN ELEMENTS
//===============================================================
const infoBox = document.getElementById("infoBox");
const houseImg = document.getElementById("house-img");

//===============================================================
// 2. TOGGLE ICONS (ON/OFF INTERACTIVE BUTTONS)
//===============================================================
document.querySelectorAll(".icon.toggle").forEach((icon) => {
  // Initial Setup/ Give a default state if missing
  if (!icon.dataset.state) icon.dataset.state = "off";

  // When user clicks the icon
  icon.addEventListener("click", () => {
    console.log("Toggle clicked:", icon.id);

    // Switch state
    const isOn = icon.dataset.state === "on";
    icon.dataset.state = isOn ? "off" : "on";

    // Change icon image
    icon.src =
      icon.dataset.state === "on" ? icon.dataset.imgOn : icon.dataset.imgOff;

    // Show corresponding text
    const message =
      icon.dataset.state === "on" ? icon.dataset.textOn : icon.dataset.textOff;

    showInfo(message);

    // Update house (night if lamps are on)
    const lamp1On = document.getElementById("lamp1")?.dataset.state === "on";
    const lamp2On = document.getElementById("lamp2")?.dataset.state === "on";

    houseImg.src =
      lamp1On || lamp2On ? "assets/house-night.svg" : "assets/house.svg";

    console.log("New state:", icon.dataset.state);
  });
});

//===============================================================
// 3. INFO ICONS (STATIC, JUST SHOW TEXT)
//===============================================================
document.querySelectorAll(".icon.info").forEach((icon) => {
  icon.addEventListener("click", () => {
    console.log("Info clicked:", icon.id);
    showInfo(icon.dataset.text);
  });
});

//===============================================================
//4. INFO BOX FUNCTIONS
//===============================================================
function showInfo(htmlText) {
  infoBox.innerHTML = `<span class="close-btn" onclick="hideInfo()">×</span>${htmlText}`;
  infoBox.style.display = "block";
}

function hideInfo() {
  infoBox.style.display = "none";
  console.log("Info box closed");
}

//===============================================================
//5. POPUPS (MISSION + SOURCE)
//===============================================================
const missionButton = document.getElementById("mission-button");
const missionPopup = document.getElementById("mission-popup");
const closeMission = document.getElementById("close-mission");

const sourceButton = document.getElementById("source-button");
const modal = document.getElementById("pop-up");
const closeModal = document.getElementById("close-pop-up");

// Mission popup
missionButton?.addEventListener("click", () => {
  missionPopup.style.display = "flex";
  console.log("Mission popup opened");
});

closeMission?.addEventListener("click", () => {
  missionPopup.style.display = "none";
});

missionPopup?.addEventListener("click", (e) => {
  // If user clicks the background, close
  if (e.target === missionPopup) {
    missionPopup.style.display = "none";
  }
});

// Source popup
sourceButton?.addEventListener("click", () => {
  modal.style.display = "flex";
  console.log("Source popup opened");
});

closeModal?.addEventListener("click", () => {
  modal.style.display = "none";
});

modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

//===============================================================
// 6. ENERGY CONSUMPTION CALCULATOR
//===============================================================
const peopleSelect = document.getElementById("people");
const typeSelect = document.getElementById("type");
const result = document.getElementById("result");

// Simple lookup table
const consumptionData = {
  "1-detached": "2'700 kWh/an",
  "1-apartment": "2'200 kWh/an",
  "2-detached": "3'550 kWh/an",
  "2-apartment": "2'750 kWh/an",
  "4-detached": "5'200 kWh/an",
  "4-apartment": "3'850 kWh/an",
};

// When user clicks calculate
document.getElementById("calcBtn").addEventListener("click", () => {
  console.log("Calculate button clicked");

  const key = `${peopleSelect.value}-${typeSelect.value}`;
  const consumption = consumptionData[key];

  console.log("Key:", key, "| Consumption:", consumption);

  if (consumption) {
    result.textContent = `Consommation moyenne estimée : ${consumption}`;
  } else {
    result.textContent = "❗ Veuillez sélectionner les deux options.";
  }
});
