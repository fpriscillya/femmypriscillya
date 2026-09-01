const QUESTIONS = [
  {
    q: "You turn the detector on in a normal classroom, with no special source nearby. In one minute, what does it show?",
    opts: [
      "Nothing, a blank grid",
      "A handful of marks",
      "A steady stream of marks",
    ],
  },
  {
    q: "Three particles hit the sensor: an alpha, a beta, and a cosmic muon. Which leaves the biggest, densest mark on the grid?",
    opts: ["The alpha", "The beta", "The muon"],
  },
  {
    q: "You hold a banana next to the detector. Compared with the empty-room count, the banana gives...",
    opts: ["More marks", "About the same", "Fewer marks"],
  },
  {
    q: "Two groups measure the same Brazil nuts, for the same length of time. Their counts will be...",
    opts: ["Exactly the same", "Close, but not the same", "Very different"],
  },
  {
    q: "In a one-minute measurement indoors with no source, how many cosmic-ray muon tracks will you catch?",
    opts: ["None", "A few", "Dozens"],
  },
];

const form = document.getElementById("quizForm");
const bar = document.getElementById("quizBar");
const resultBox = document.getElementById("quizResult");
const resultList = document.getElementById("resultList");
const answers = new Array(QUESTIONS.length).fill(null);

// build questions
QUESTIONS.forEach((item, i) => {
  const card = document.createElement("div");
  card.className = "qcard";
  card.innerHTML =
    '<div class="qcard__num">Prediction ' +
    (i + 1) +
    " of " +
    QUESTIONS.length +
    "</div>" +
    '<p class="qcard__q">' +
    item.q +
    "</p>" +
    '<div class="qopts">' +
    item.opts
      .map(
        (opt, j) =>
          '<label class="qopt"><input type="radio" name="q' +
          i +
          '" value="' +
          j +
          '">' +
          "<span>" +
          opt +
          "</span></label>",
      )
      .join("") +
    "</div>";
  form.appendChild(card);
});

// track selections
form.addEventListener("change", (e) => {
  if (e.target.name && e.target.name.startsWith("q")) {
    const qi = parseInt(e.target.name.slice(1), 10);
    answers[qi] = parseInt(e.target.value, 10);

    // highlight chosen option within this question
    form
      .querySelectorAll('input[name="q' + qi + '"]')
      .forEach((inp) =>
        inp.closest(".qopt").classList.toggle("qopt--chosen", inp.checked),
      );

    updateProgress();
  }
});

function updateProgress() {
  const done = answers.filter((a) => a !== null).length;
  bar.style.width = (done / QUESTIONS.length) * 100 + "%";
  if (done === QUESTIONS.length) showResult();
}

function showResult() {
  resultList.innerHTML = "";
  QUESTIONS.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML =
      '<span class="result__q">' +
      item.q +
      "</span>" +
      '<span class="result__a">My prediction: ' +
      item.opts[answers[i]] +
      "</span>";
    resultList.appendChild(li);
  });
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

document
  .getElementById("printBtn")
  .addEventListener("click", () => window.print());

document.getElementById("editBtn").addEventListener("click", () => {
  resultBox.hidden = true;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});
