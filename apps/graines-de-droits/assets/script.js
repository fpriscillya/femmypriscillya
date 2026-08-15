// ---------- UTILITAIRES ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------- NAVIGATION PRINCIPALE ----------
function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  $$(".global-btn").forEach((b) =>
    b.classList.toggle("active", b.dataset.screen === id)
  );
}

$$(".global-btn").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.screen));
});

$$(".role-card").forEach((card) => {
  card.addEventListener("click", () => showScreen(card.dataset.screen));
});

// ---------- NAVIGATION ESPACE ELEVES ----------
function showSubscreen(containerId, targetId) {
  document
    .querySelectorAll("#" + containerId + " .subscreen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(targetId).classList.add("active");
}

$("#eleves-subnav").addEventListener("click", (e) => {
  const btn = e.target.closest(".subnav-btn");
  if (!btn) return;

  const target = btn.dataset.subscreen;

  $$("#eleves-subnav .subnav-btn").forEach((b) =>
    b.classList.toggle("active", b === btn)
  );

  showSubscreen("eleves", target);
});

// ---------- NAVIGATION ESPACE ENSEIGNANTS ----------
$("#enseignants-subnav").addEventListener("click", (e) => {
  const btn = e.target.closest(".subnav-btn");
  if (!btn) return;

  const target = btn.dataset.subscreen;

  $$("#enseignants-subnav .subnav-btn").forEach((b) =>
    b.classList.toggle("active", b === btn)
  );

  showSubscreen("enseignants", target);
});

// ---------- TABLEAU DE BORD : mission simple ----------
$("#btn-mission-week").addEventListener("click", () => {
  const btn = $("#btn-mission-week");
  const done = btn.classList.toggle("done");
  btn.textContent = done ? "Mission accomplie 🎉" : "✅ Je l’ai fait";
  const cps = $("#cps-progress");
  const currentWidth = parseFloat(cps.style.width || "30");
  cps.style.width =
    (done ? Math.min(currentWidth + 20, 100) : Math.max(currentWidth - 20, 0)) +
    "%";
  showToast("Ta mission de la semaine a été mise à jour.");
});

// ---------- TABLEAU DE BORD : Profile editing ----------
document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editProfileBtn");
  const saveBtn = document.getElementById("saveProfileBtn");
  const cancelBtn = document.getElementById("cancelProfileBtn");
  const profileText = document.getElementById("profileDescription");
  const profileEditor = document.querySelector(".profile-editor");
  const profileInput = document.getElementById("profileInput");

  // Open editor
  editBtn.addEventListener("click", () => {
    profileInput.value = profileText.innerHTML;
    profileEditor.classList.remove("hidden");
    editBtn.classList.add("hidden");
  });

  // Save changes
  saveBtn.addEventListener("click", () => {
    profileText.innerHTML = profileInput.value;
    profileEditor.classList.add("hidden");
    editBtn.classList.remove("hidden");
    showToast("Ton profil a été mis à jour !");
  });

  // Cancel editing
  cancelBtn.addEventListener("click", () => {
    profileEditor.classList.add("hidden");
    editBtn.classList.remove("hidden");
  });
});

// ---------- HISTOIRES INTERACTIVES ----------
document.addEventListener("DOMContentLoaded", () => {
  const stories = [
    {
      id: "ep1",
      title: "Semaine 1 – Le débat en classe",
      competenceKey: "communication",
      summaryLabel:
        "écouter avant de répondre et proposer une règle commune pour la parole",
      nodes: {
        start: {
          text: "En classe, la maîtresse propose un débat. Clara veut donner son avis, mais plusieurs élèves parlent très fort en même temps.",
          cps: "Écoute active",
          right: "Droit d’être entendu – art. 12",
          choices: [
            {
              label:
                "Parler plus fort que les autres pour être sûre d’être entendue.",
              next: "parlerFort",
            },
            {
              label:
                "Lever la main et attendre que la maîtresse lui donne la parole.",
              next: "leverMain",
            },
          ],
        },
        parlerFort: {
          text: "Clara parle très fort. Tout le monde se coupe la parole et personne ne s’écoute vraiment.",
          cps: "Gestion des conflits",
          right: "Respect de chacun",
          choices: [
            {
              label:
                "S’arrêter, respirer, et proposer une règle pour se passer la parole.",
              next: "regleParole",
            },
          ],
        },
        leverMain: {
          text: "Clara lève la main. La maîtresse la remercie d’avoir attendu son tour et lui donne la parole.",
          cps: "Écoute active",
          right: "Participation",
          choices: [
            {
              label:
                "Proposer que chacun ait un temps pour parler sans être interrompu.",
              next: "regleParole",
            },
          ],
        },
        regleParole: {
          text: "La classe décide d’utiliser un bâton de parole. Quand quelqu’un le tient, il ou elle peut parler sans être interrompu·e.",
          cps: "Résolution de problème en groupe",
          right: "Droit d’exprimer son opinion",
          end: true,
          summary: {
            competence:
              "Écouter avant de répondre et proposer une règle pour que chacun puisse parler.",
            right: "Être entendu·e (art. 12) dans un débat respectueux.",
          },
        },
      },
    },
    {
      id: "ep2",
      title: "Semaine 2 – Une élève mise de côté",
      competenceKey: "empathie",
      summaryLabel:
        "remarquer quand quelqu’un est exclu et proposer de l’inclure dans le jeu",
      nodes: {
        start: {
          text: "À la récréation, un groupe joue à un nouveau jeu. Noa reste seul·e près du mur.",
          cps: "Empathie",
          right: "Droit au jeu et au repos – art. 31",
          choices: [
            {
              label: "Aller voir Noa pour lui demander s’il/elle veut jouer.",
              next: "inviterNoa",
            },
            { label: "Continuer à jouer sans rien dire.", next: "ignorerNoa" },
          ],
        },
        ignorerNoa: {
          text: "Le jeu continue, mais Clara sent un petit pincement au cœur en regardant Noa seul·e.",
          cps: "Conscience de soi",
          right: "Respect des autres",
          choices: [
            {
              label: "Finalement, aller lui parler et l’inviter à jouer.",
              next: "inviterNoa",
            },
          ],
        },
        inviterNoa: {
          text: "Noa accepte l’invitation. Le jeu devient encore plus amusant avec une personne de plus.",
          cps: "Empathie et ouverture aux autres",
          right: "Droit de ne pas être exclu·e",
          end: true,
          summary: {
            competence:
              "Remarquer quand quelqu’un est exclu et lui proposer de participer.",
            right:
              "Droit au jeu et à la participation avec les autres (art. 31).",
          },
        },
      },
    },
  ];

  let currentStory = null;
  let currentNodeId = null;

  const episodeList = $("#episodeList");
  const storyText = $("#storyText");
  const cpsBadge = $("#storyCpsBadge");
  const rightBadge = $("#storyRightBadge");
  const choiceList = $("#choiceList");
  const storySummary = $("#storySummary");

  function renderEpisodeList() {
    episodeList.innerHTML = "";
    stories.forEach((story) => {
      const btn = document.createElement("button");
      btn.className = "episode-btn";
      btn.textContent = story.title;
      btn.dataset.id = story.id;
      btn.addEventListener("click", () => startStory(story.id, btn, false));
      episodeList.appendChild(btn);
    });
  }

  function startStory(id, btn, fromSuggestion = false) {
    currentStory = stories.find((s) => s.id === id);
    currentNodeId = "start";
    $$("#episodeList .episode-btn").forEach((b) =>
      b.classList.toggle("active", b === btn)
    );
    renderCurrentNode();

    if (fromSuggestion) {
      $("#competenceSuggestionInfo").textContent =
        "Cette histoire a été proposée car elle correspond à ce que tu veux travailler.";
    }
  }

  function renderCurrentNode() {
    if (!currentStory) return;
    const node = currentStory.nodes[currentNodeId];
    storyText.textContent = node.text;
    cpsBadge.textContent = "CPS : " + node.cps;
    rightBadge.textContent = "Droit : " + node.right;

    choiceList.innerHTML = "";
    storySummary.style.display = "none";

    if (node.end) {
      const p = document.createElement("p");
      p.textContent = "Fin de l’histoire 🌱";
      choiceList.appendChild(p);

      storySummary.style.display = "block";
      storySummary.innerHTML = `
        <strong>Fiche d’apprentissage disponible :</strong><br>
        Tu peux lire la fiche qui vient de s’ouvrir pour voir clairement
        quelle compétence et quel droit tu as travaillés.
      `;

      // --- FICHE POPUP ---
      const ficheModal = document.getElementById("ficheModal");
      const ficheContent = document.getElementById("ficheContent");

      ficheContent.innerHTML = `
        <h3>Fiche d’apprentissage – Graines de droits</h3>

        <p>
          <strong>Ce que tu as travaillé dans cette histoire :</strong><br>
          • <strong>Compétence psychosociale :</strong> ${node.summary.competence}<br>
          • <strong>Droit de l’enfant :</strong> ${node.summary.right}
        </p>

        <p>
          <strong>Ce que ça veut dire :</strong><br>
          Cette histoire te montre qu’il ne s’agit pas seulement de “bien se tenir”,
          mais de comprendre comment tes actions peuvent respecter tes droits et 
          ceux des autres. La compétence que tu as travaillée t’aide à mieux vivre
          avec les autres et à faire respecter tes droits au quotidien.
        </p>

        <p>
          <strong>Quand utiliser ce que tu as appris ?</strong><br>
          • En classe (discussion, débat, travail de groupe)<br>
          • Dans la cour (conflit, exclusion, moquerie, photo partagée, etc.)<br>
          • À la maison (désaccord, dispute, moment de stress)
        </p>

        <p>
          <strong>Ce que tu peux essayer concrètement cette semaine :</strong><br>
          Pense à une situation réelle où tu pourrais utiliser cette compétence.
          Par exemple : proposer une règle plus juste, inviter quelqu’un à participer,
          demander la parole sans couper, respirer avant de répondre, demander de l’aide.
        </p>

        <p>
          <strong>Avec qui en parler ?</strong><br>
          Tu peux en parler avec ton/ta enseignant·e, un·e camarade ou tes parents
          pour expliquer ce que tu as compris et comment tu veux t’en servir.
        </p>

        <p style="margin-top: 10px; font-weight: bold;">
          Cette fiche sert à garder une trace de ton apprentissage : c’est une 
          “institutionnalisation” de ce que la classe peut retenir ensemble.
        </p>
      `;

      ficheModal.classList.add("show");
      showToast("Histoire terminée – fiche d’apprentissage ouverte 🌱");

      const rights = $("#rights-progress");
      const width = parseFloat(rights.style.width || "20");
      rights.style.width = Math.min(width + 10, 100) + "%";

      return;
    }

    node.choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label;
      btn.addEventListener("click", () => {
        currentNodeId = choice.next;
        renderCurrentNode();
      });
      choiceList.appendChild(btn);
    });
  }

  renderEpisodeList();

  // ---------- SUGGESTION D’HISTOIRE PAR COMPÉTENCE ----------
  const competenceSelect = $("#competenceSelect");
  const btnSuggestStory = $("#btnSuggestStory");
  const competenceInfo = $("#competenceSuggestionInfo");

  btnSuggestStory.addEventListener("click", () => {
    const value = competenceSelect.value;
    competenceInfo.textContent = "";

    if (!value) {
      competenceInfo.textContent =
        "Choisis d’abord la phrase qui te ressemble le plus.";
      return;
    }

    const story = stories.find((s) => s.competenceKey === value);
    if (!story) {
      competenceInfo.textContent =
        "Aucune histoire n’est encore liée à ce choix. L’enseignant·e peut proposer une autre activité.";
      return;
    }

    const btn = [...$$("#episodeList .episode-btn")].find(
      (b) => b.dataset.id === story.id
    );
    if (btn) {
      startStory(story.id, btn, true);
    }
  });
});

// ---------- FERMER LA FICHE D’APPRENTISSAGE ----------
const ficheModal = document.getElementById("ficheModal");
const ficheCloseBtn = document.getElementById("ficheCloseBtn");

if (ficheModal && ficheCloseBtn) {
  ficheCloseBtn.addEventListener("click", () => {
    ficheModal.classList.remove("show");
  });

  ficheModal.addEventListener("click", (e) => {
    if (e.target === ficheModal) {
      ficheModal.classList.remove("show");
    }
  });
}

// ---------- TIMELINE CARNET ----------
const timelineData = [
  "Séance 1 – Découvrir les droits de l’enfant.",
  "Séance 2 – Comment écouter vraiment l’autre.",
  "Séance 3 – Gérer un conflit sans crier.",
  "Séance 4 – Les émotions, à quoi ça sert ?",
];

function renderTimeline() {
  const list = $("#timelineList");
  if (!list) return;
  list.innerHTML = "";
  timelineData.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.textContent = i + 1 + ". " + t;
    list.appendChild(div);
  });
}

renderTimeline();

// ---------- ALERTES JOURNAL ----------
$$("#eleves-journal .btn-alert").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = $("#journalText").value.trim();
    const cible =
      btn.dataset.target === "parent" ? "un parent" : "l’enseignant·e";
    if (!text) {
      showToast("Écris d’abord quelques mots dans ton journal.");
      return;
    }
    alert("Message prêt à être envoyé à " + cible + " :\n\n" + text);
  });
});
  // ---------- PERIOD DESCRIPTIONS ----------
  const periodDescriptions = {
    1: `
      <strong>Période 1 — semaines 1 & 2</strong><br>
      <em>Savoir résoudre des problèmes & prendre des décisions.</em>
    `,
    2: `
      <strong>Période 2 — semaines 3 & 4</strong><br>
      <em>Développer une pensée créative & une pensée critique.</em>
    `,
    3: `
      <strong>Période 3 — semaines 5 & 6</strong><br>
      <em>Communiquer efficacement & développer des relations positives.</em>
    `,
    4: `
      <strong>Période 4 — semaines 7 & 8</strong><br>
      <em>Avoir conscience de soi & faire preuve d’empathie.</em>
    `,
    5: `
      <strong>Période 5 — semaines 9 & 10</strong><br>
      <em>Réguler ses émotions & gérer son stress.</em>
    `,
  };

  const plotButtons = document.querySelectorAll(".plot-btn");
  const periodInfo = document.querySelector("#periodInfo");

  plotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // remove "active" from all
      plotButtons.forEach((b) => b.classList.remove("active"));

      // add to clicked one
      btn.classList.add("active");

      // update info text
      const period = btn.dataset.period;
      periodInfo.innerHTML = periodDescriptions[period];
    });
  });

  // ---------- MISSIONS LIST ----------
  const missions = [
    {
      text: "Proposer une nouvelle règle pour mieux se respecter dans la classe.",
      destination: "classe",
    },
    {
      text: "Demander à quelqu’un comment il/elle se sent vraiment aujourd’hui.",
      destination: "classe",
    },
    {
      text: "À la maison, proposer un “tour de météo des émotions” avant le repas.",
      destination: "maison",
    },
  ];

  function renderMissions() {
    const container = document.querySelector("#missionsList");
    container.innerHTML = "";

    missions.forEach((m) => {
      const wrap = document.createElement("div");
      wrap.className = "mission-item";

      wrap.innerHTML = `
        <div>
          ${m.text}
          <div class="mission-status">Lieu : ${
            m.destination === "maison" ? "Maison" : "Classe"
          }</div>
        </div>
      `;

      const btn = document.createElement("button");
      btn.className = "btn-ghost";
      btn.textContent = "Je l’ai fait";

      btn.addEventListener("click", () => {
        wrap.classList.toggle("done");
        const done = wrap.classList.contains("done");
        btn.textContent = done ? "En attente de validation" : "Je l’ai fait";
        showToast("Mission mise à jour. L’enseignant·e pourra la voir.");
      });

      wrap.appendChild(btn);
      container.appendChild(wrap);
    });
  }

  renderMissions();
// ---------- ESPACE ZEN : respiration ----------
let breathInterval = null;
let breathPhase = "ready";

function startBreath() {
  clearInterval(breathInterval);

  const circle = $("#breathCircle");
  const instruction = $("#breathInstruction");

  breathPhase = "inhale";
  let timeLeft = 4;

  circle.classList.add("expanding");
  circle.textContent = "Inspire (" + timeLeft + ")";
  instruction.textContent = "Inspire doucement… (" + timeLeft + " secondes)";

  breathInterval = setInterval(() => {
    timeLeft--;

    if (breathPhase === "inhale") {
      circle.textContent = "Inspire (" + timeLeft + ")";
      instruction.textContent =
        "Inspire doucement… (" + timeLeft + " secondes)";
    } else {
      circle.textContent = "Expire (" + timeLeft + ")";
      instruction.textContent = "Expire lentement… (" + timeLeft + " secondes)";
    }

    if (timeLeft <= 0) {
      if (breathPhase === "inhale") {
        breathPhase = "exhale";
        timeLeft = 4;
        circle.classList.remove("expanding");
      } else {
        breathPhase = "inhale";
        timeLeft = 4;
        circle.classList.add("expanding");
      }
    }
  }, 1000);
}

function stopBreath() {
  clearInterval(breathInterval);

  const circle = $("#breathCircle");
  const instruction = $("#breathInstruction");

  circle.classList.remove("expanding");
  circle.textContent = "Pause";
  instruction.textContent = "Tu peux relancer l’exercice quand tu veux.";
}

$("#btnBreath").addEventListener("click", startBreath);
$("#btnBreathStop").addEventListener("click", stopBreath);

// ---------- ESPACE ZEN : besoins ----------
const needsData = {
  calme: {
    text: "Tu as besoin de calme.",
    help: "Tu peux t’installer dans un coin tranquille, faire quelques respirations lentes, ou demander à réduire le bruit autour de toi.",
  },
  mouvement: {
    text: "Tu as besoin de mouvement.",
    help: "Tu peux te lever, t’étirer, marcher un peu, ou proposer un jeu qui permet de bouger pendant la récréation.",
  },
  aide: {
    text: "Tu as besoin d’aide.",
    help: "Tu peux demander de l’aide à un·e enseignant·e, un·e camarade ou un parent en expliquant ce qui est difficile pour toi.",
  },
  parler: {
    text: "Tu as besoin de parler.",
    help: "Choisis une personne de confiance (ami·e, adulte) et explique ce que tu ressens ou ce qui s’est passé.",
  },
  pause: {
    text: "Tu as besoin d’une pause.",
    help: "Tu peux demander un temps pour t’isoler un peu, boire un verre d’eau ou simplement regarder par la fenêtre quelques instants.",
  },
};

const moodRow = $("#moodRow");
if (moodRow) {
  moodRow.addEventListener("click", (e) => {
    const needEl = e.target.closest(".need");
    if (!needEl) return;

    $$("#moodRow .need").forEach((n) => n.classList.remove("selected"));
    needEl.classList.add("selected");

    const key = needEl.dataset.need;
    const info = needsData[key];
    if (!info) return;

    $("#moodText").innerHTML = `
      <strong>Besoin identifié :</strong> ${info.text}<br/>
      <strong>Idées d’actions possibles :</strong> ${info.help}
    `;
  });
}

// ---------- ESPACE ALTERO ----------
const canvas = document.getElementById("altero-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let tool = "pencil";

  const colorInput = document.getElementById("color-input");
  const sizeInput = document.getElementById("size-input");

  document.getElementById("tool-pencil").onclick = () => (tool = "pencil");
  document.getElementById("tool-eraser").onclick = () => (tool = "eraser");

  document.getElementById("tool-clear").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  canvas.addEventListener("mousedown", () => {
    drawing = true;
    ctx.beginPath();
  });
  canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
  });
  canvas.addEventListener("mouseleave", () => {
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = sizeInput.value;
    ctx.lineCap = "round";

    ctx.strokeStyle = tool === "pencil" ? colorInput.value : "#ffffff";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  document
    .getElementById("altero-upload")
    .addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;
      const img = new Image();

      img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.src = URL.createObjectURL(file);
    });

  document.getElementById("save-altero").onclick = () => {
    const text = document.getElementById("altero-description").value;
    alert("Ton Altero est sauvegardé !\n\n" + text);
  };
}

// ---------- ESPACE PARENTS : mini-défis + forum ----------
const parentChallengesData = [
  {
    text: "Prendre un moment pour que chacun partage son émotion du jour.",
    done: false,
  },
  {
    text: "Décider ensemble d’une règle de respect pendant le repas.",
    done: false,
  },
];

function renderParentChallenges() {
  const container = $("#parentChallenges");
  if (!container) return;
  container.innerHTML = "";

  parentChallengesData.forEach((c) => {
    const item = document.createElement("div");
    item.className = "mini-item" + (c.done ? " done" : "");

    item.innerHTML = `<div class="mini-text">${c.text}</div>`;

    const comment = document.createElement("textarea");
    comment.className = "mini-comment";
    comment.placeholder = "Mini commentaire…";
    comment.value = c.comment || "";
    comment.addEventListener("input", () => {
      c.comment = comment.value;
    });

    const btn = document.createElement("button");
    btn.className = "btn-challenge";
    btn.textContent = c.done ? "Refaire" : "Nous l’avons fait";
    btn.addEventListener("click", () => {
      c.done = !c.done;
      renderParentChallenges();
      showToast("Défi maison mis à jour.");
    });

    item.appendChild(comment);
    item.appendChild(btn);
    container.appendChild(item);
  });
}

renderParentChallenges();

// --- Forum parents ---
const parentForumMessages = [
  {
    text: "Nous faisons la météo (maintenant les besoins) du soir, ça nous aide beaucoup.",
    time: "Aujourd’hui",
  },
  {
    text: "On a affiché les droits de l’enfant sur le frigo, les enfants adorent.",
    time: "Hier",
  },
];

function renderParentForum() {
  const box = $("#parentForum");
  if (!box) return;
  box.innerHTML = "";

  parentForumMessages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "forum-message";
    div.innerHTML = `
      ${msg.text}
      <span class="timestamp">${msg.time}</span>
    `;
    box.appendChild(div);
  });
}

renderParentForum();

const btnParentForum = $("#btnParentForum");
if (btnParentForum) {
  btnParentForum.addEventListener("click", () => {
    const input = $("#parentForumInput");
    const text = input.value.trim();
    if (!text) return;

    parentForumMessages.push({
      text: text,
      time: "Aujourd’hui",
    });
    input.value = "";
    renderParentForum();
    showToast("Message ajouté au forum parents.");
  });
}

// ---------- ESPACE ENSEIGNANTS : formation ----------
const moduleStates = {
  1: false,
  2: false,
  3: false,
};

function updateFormationProgress() {
  const total = Object.keys(moduleStates).length;
  const done = Object.values(moduleStates).filter(Boolean).length;
  const label = $("#formationProgress");
  if (label) {
    label.textContent = `${done} / ${total} modules complétés`;
  }
}

$$(".module-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const li = btn.closest(".module-item");
    const id = li.dataset.moduleId;
    moduleStates[id] = !moduleStates[id];
    if (moduleStates[id]) {
      li.style.textDecoration = "line-through";
      btn.textContent = "Marqué comme fait";
    } else {
      li.style.textDecoration = "none";
      btn.textContent = "Marquer comme fait";
    }
    updateFormationProgress();
  });
});

updateFormationProgress();

// ---------- ESPACE ENSEIGNANTS : activités ----------
const activitiesData = [
  {
    label:
      "Cercle de parole avec bâton de parole (écoute active et droit d’être entendu).",
    type: "communication",
  },
  {
    label:
      "Jeu de rôle “inviter quelqu’un à jouer” (empathie et droit au jeu).",
    type: "conflit",
  },
  {
    label: "Thermomètre des émotions en groupe (émotions et auto-régulation).",
    type: "emotions",
  },
  {
    label:
      "Conseil de classe avec vote sur une règle (participation et art. 12).",
    type: "participation",
  },
];

function renderActivities(filter = "") {
  const list = $("#activityList");
  if (!list) return;
  list.innerHTML = "";
  activitiesData
    .filter((a) => !filter || a.type === filter)
    .forEach((a) => {
      const li = document.createElement("li");
      li.textContent = a.label;
      list.appendChild(li);
    });
}

renderActivities();

const activityFilter = $("#activityFilter");
if (activityFilter) {
  activityFilter.addEventListener("change", () => {
    renderActivities(activityFilter.value);
  });
}

// ---------- ESPACE ENSEIGNANTS : suivi des missions ----------
const teacherMissionsData = [
  {
    eleve: "Clara",
    texte: "Proposer une nouvelle règle pour mieux se respecter dans la classe.",
    statut: "En attente",
  },
  {
    eleve: "Noa",
    texte: "Inviter un camarade à jouer qui était souvent seul.",
    statut: "En attente",
  },
];

function renderTeacherMissions() {
  const container = $("#teacherMissions");
  if (!container) return;
  container.innerHTML = "";

  teacherMissionsData.forEach((m, index) => {
    const wrap = document.createElement("div");
    wrap.className = "mission-item";
    wrap.innerHTML = `
      <div>
        <strong>${m.eleve}</strong> – ${m.texte}
        <div class="mission-status">Statut : ${m.statut}</div>
      </div>
    `;

    const btn = document.createElement("button");
    btn.className = "btn-ghost";
    btn.textContent =
      m.statut === "Validée" ? "Annuler la validation" : "Valider la mission";
    btn.addEventListener("click", () => {
      teacherMissionsData[index].statut =
        teacherMissionsData[index].statut === "Validée"
          ? "En attente"
          : "Validée";
      renderTeacherMissions();
      showToast("Suivi de mission mis à jour.");
    });

    wrap.appendChild(btn);
    container.appendChild(wrap);
  });
}

renderTeacherMissions();

// ---------- ESPACE ENSEIGNANTS : forum ----------
const teacherForumMessages = [
  {
    text: "J’ai testé le bâton de parole, ça a vraiment aidé les élèves timides.",
    time: "Aujourd’hui",
  },
  {
    text: "Je cherche une idée pour aborder le cyberharcèlement en 7P.",
    time: "Hier",
  },
];

function renderTeacherForum() {
  const box = $("#teacherForum");
  if (!box) return;
  box.innerHTML = "";
  teacherForumMessages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "forum-message";
    div.innerHTML = `
      ${msg.text}
      <span class="timestamp">${msg.time}</span>
    `;
    box.appendChild(div);
  });
}

renderTeacherForum();

const btnTeacherForum = $("#btnTeacherForum");
if (btnTeacherForum) {
  btnTeacherForum.addEventListener("click", () => {
    const input = $("#teacherForumInput");
    const text = input.value.trim();
    if (!text) return;
    teacherForumMessages.push({ text, time: "Aujourd’hui" });
    input.value = "";
    renderTeacherForum();
    showToast("Message ajouté au forum enseignant·es.");
  });
}

// ---------- ESPACE PARTAGÉ PARENTS-ENSEIGNANTS ----------
const sharedForumMessages = [
  {
    text: "Seriez-vous d’accord pour co-construire une charte d’usage des écrans avec les élèves ?",
    time: "Cette semaine",
  },
];

function renderSharedForum() {
  const box = $("#sharedForum");
  if (!box) return;
  box.innerHTML = "";
  sharedForumMessages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "forum-message";
    div.innerHTML = `
      ${msg.text}
      <span class="timestamp">${msg.time}</span>
    `;
    box.appendChild(div);
  });
}

renderSharedForum();

const btnSharedForum = $("#btnSharedForum");
if (btnSharedForum) {
  btnSharedForum.addEventListener("click", () => {
    const input = $("#sharedForumInput");
    const text = input.value.trim();
    if (!text) return;
    sharedForumMessages.push({ text, time: "Aujourd’hui" });
    input.value = "";
    renderSharedForum();
    showToast("Message ajouté au forum école-famille.");
  });
}
// ============================================
// SLIDESHOW BD - Navigation entre les images
// À ajouter dans votre fichier script.js existant
// ============================================

(function() {
  // Liste exacte des images dans l'ordre d'affichage
  const bdImages = [
    "assets/images-bd/histoire-enfant-1.jpg",
    "assets/images-bd/histoire-enfant-2.jpg",
    "assets/images-bd/histoire-enfant-3.jpg",
    "assets/images-bd/histoire-enfant-3.1.jpg",
    "assets/images-bd/histoire-enfant-4.jpg",
    "assets/images-bd/histoire-enfant-5.jpg",
    "assets/images-bd/histoire-enfant-6.jpg",
    "assets/images-bd/histoire-enfant-7.jpg",
    "assets/images-bd/histoire-enfant-7.1.jpg",
    "assets/images-bd/histoire-enfant-8.jpg",
    "assets/images-bd/histoire-enfant-10.jpg",
    "assets/images-bd/histoire-enfant-11.jpg",
    "assets/images-bd/histoire-enfant-12.jpg",
    "assets/images-bd/histoire-enfant-13.jpg",
    "assets/images-bd/histoire-enfant-13.1.jpg",
    "assets/images-bd/histoire-enfant-14.jpg",
    "assets/images-bd/histoire-enfant-14.1.jpg"
  ];

  // État du slideshow
  let currentBdSlide = 0; // Index dans le tableau (commence à 0)
  const totalBdSlides = bdImages.length;

  /**
   * Initialise le slideshow BD
   */
  function initBdSlideshow() {
    // Éléments DOM
    const bdImage = document.getElementById('bdImage');
    const bdCounter = document.getElementById('bdCounter');
    const bdPrevBtn = document.getElementById('bdPrev');
    const bdNextBtn = document.getElementById('bdNext');

    // Vérifier que les éléments existent
    if (!bdImage || !bdCounter || !bdPrevBtn || !bdNextBtn) {
      console.warn('Éléments du slideshow BD non trouvés');
      return;
    }

    /**
     * Met à jour l'affichage du slideshow
     */
    function updateBdSlide() {
      // Mise à jour de l'image
      bdImage.src = bdImages[currentBdSlide];
      bdImage.alt = `BD réseaux sociaux - Planche ${currentBdSlide + 1}`;
      
      // Mise à jour du compteur (affichage commence à 1 pour l'utilisateur)
      bdCounter.textContent = `${currentBdSlide + 1} / ${totalBdSlides}`;
      
      // Gestion des boutons Précédent
      if (currentBdSlide === 0) {
        bdPrevBtn.style.opacity = '0.5';
        bdPrevBtn.style.cursor = 'not-allowed';
      } else {
        bdPrevBtn.style.opacity = '1';
        bdPrevBtn.style.cursor = 'pointer';
      }
      
      // Gestion des boutons Suivant
      if (currentBdSlide === totalBdSlides - 1) {
        bdNextBtn.style.opacity = '0.5';
        bdNextBtn.style.cursor = 'not-allowed';
      } else {
        bdNextBtn.style.opacity = '1';
        bdNextBtn.style.cursor = 'pointer';
      }
    }

    /**
     * Navigation vers la diapositive précédente
     */
    function previousBdSlide(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (currentBdSlide > 0) {
        currentBdSlide--;
        updateBdSlide();
      }
    }

    /**
     * Navigation vers la diapositive suivante
     */
    function nextBdSlide(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (currentBdSlide < totalBdSlides - 1) {
        currentBdSlide++;
        updateBdSlide();
      }
    }

    /**
     * Navigation au clavier (flèches gauche/droite)
     */
    function handleBdKeyboard(event) {
      // Vérifier si on est sur l'écran BD
      const bdSubscreen = document.getElementById('eleves-bd');
      if (!bdSubscreen || !bdSubscreen.classList.contains('active')) {
        return;
      }
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentBdSlide > 0) {
          currentBdSlide--;
          updateBdSlide();
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentBdSlide < totalBdSlides - 1) {
          currentBdSlide++;
          updateBdSlide();
        }
      }
    }

    // Événements des boutons
    bdPrevBtn.addEventListener('click', previousBdSlide);
    bdNextBtn.addEventListener('click', nextBdSlide);

    // Navigation au clavier
    document.addEventListener('keydown', handleBdKeyboard);

    // Initialisation au chargement
    updateBdSlide();

    /**
     * Précharge toutes les images pour une navigation fluide
     */
    function preloadBdImages() {
      bdImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }

    // Lancer le préchargement après un court délai
    setTimeout(preloadBdImages, 1000);
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBdSlideshow);
  } else {
    initBdSlideshow();
  }
})();