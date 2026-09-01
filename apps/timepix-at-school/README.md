# TIMEPIX@school (Pre-lab) Orientation Handover guide for editors

---

## Folder structure

```
timepix-prelab/
├── index.html                  Main lesson page (Theory, Detector, Decay, Activities)
├── activity-1.html             Worksheet: Background radiation
├── activity-2.html             Worksheet: Everyday materials
├── activity-3.html             Worksheet: Radon balloon
├── activity-4.html             Worksheet: Potassium-40 half-life
├── activity-5.html             Worksheet: Vacuum filter
├── activity-6.html             Worksheet: Radiation at different altitudes
├── css/
│   ├── styles.css              Shared styles for index.html (palette, nav, cards)
│   └── worksheet.css           Styles for activity worksheets
├── js/
│   └── lesson.js               All interactivity (hero animation, flip cards,
│                               hotspots, penetration diagram, misconceptions,
│                               exponential decay graphs, nav scroll)
├── assets/
│   ├── timepix-logo.svg        Logo in nav and worksheet top bar
│   ├── minipix.jpg             Photo of the MiniPIX detector
│   ├── pixet-screenshot.jpg    Pixet Basic software screenshot
│   ├── laptop.png              Pixel art illustration for Activity 1
│   ├── banana.png              Pixel art illustration for Activity 2
│   ├── balloon.png             Pixel art illustration for Activity 3
│   ├── salt.png                Pixel art illustration for Activity 4
│   ├── vacuum-cleaner.png      Pixel art illustration for Activity 5
│   ├── MiniPIX.png             Illustration in "What it is" card
│   ├── rock.png                Illustration in "It is all around us" card
│   ├── earth.png               Illustration in "From space" card
│   ├── satellite.png           Between X-ray note and penetration diagram
│   ├── pencil.png              illustration for Activity 1
│   └── paper.png               illustration for Activity 1
├── README.md                   This file
├── LICENSE                     CC BY-SA 4.0
└── .gitignore
```

---

## Colour palette

All colours are defined as CSS variables at the top of `css/styles.css`.

| Variable        | Hex       | Used for                                       |
| --------------- | --------- | ---------------------------------------------- |
| `--teal`        | `#1ebcba` | Primary buttons, active states, teal flip card |
| `--coral`       | `#f08081` | Accent, lock buttons, coral flip card front    |
| `--teal-light`  | `#b6e1df` | Tint backgrounds, hover states                 |
| `--coral-light` | `#f4d3d3` | Info panels, prediction backgrounds            |
| `--ink`         | `#1c2b2b` | Body text                                      |
| `--ink-60`      | `#51635f` | Secondary text, captions                       |

Nav bar and footer use `#000000` (black).

To change the palette: edit `:root { }` at the top of `css/styles.css`. All components inherit automatically.

---

## Typography

Font loaded from Google Fonts in each HTML `<head>`:

- **Open Sans** for all body text and headings
- **Roboto Mono** for instrument readouts and code-style labels

To change the font: replace the Google Fonts link in each HTML file and update `--font` and `--mono` in `css/styles.css`.

---

## Page structure (index.html)

The main lesson page has four sections in this order, reflected in the sticky nav:

1. **Theory** — radiation types, four flip cards (alpha, beta, gamma, muon), X-ray note, penetration diagram, "It is all around us", "From space", "True or false?" misconceptions
2. **The Detector** — what MiniPIX is, how it sees radiation, Pixet Basic hotspots, handling and safety
3. **Decay** — exponential decay explainer with two animated graphs (click to trigger)
4. **Activities** — five preview cards linking to the five worksheets

---

## Where to update text

### index.html

| What                                  | Where to find it in VS Code                                               |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Hero headline and lead paragraph      | Search `hero__title` and `hero__lead`                                     |
| Theory intro                          | Search `id="theory"`                                                      |
| What radiation is card                | Search `What radiation is`                                                |
| Flip card descriptions                | Search `flip__sub` and `track-label`                                      |
| X-ray note                            | Search `xray-note`                                                        |
| Penetration paragraph                 | Search `How far each type`                                                |
| "It is all around us" card            | Search `all around us`                                                    |
| "From space" card                     | Search `From space`                                                       |
| Misconceptions (tap-to-reveal)        | Search `misc-item`; each block has `misc-tag`, `misc-teaser`, `misc-body` |
| Trigger question below misconceptions | Search `misc-trigger`                                                     |
| Detector intro                        | Search `id="detector"`                                                    |
| Pixet hotspot labels and body text    | Search `data-title` and `data-body` (6 instances)                         |
| Safety checklist                      | Search `checklist`                                                        |
| Exponential decay text                | Search `id="decay"`                                                       |
| Decay graph labels                    | Search `decay-label`                                                      |
| Activity preview card text            | Search `id="activities"`, then each `preview-card` block                  |
| Footer copyright line                 | Search `foot__prov`                                                       |

### activity-1.html to activity-6.html

| What                               | Where to find it                                                       |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Page title and subtitle            | Search `sheet__eyebrow`, `h1`, `sheet__sub`                            |
| Prediction questions and options   | Search `pred-opt` (activities 1 and 2) or `iradio` (activities 3 to 6) |
| Observation table rows             | Search `ws-table`                                                      |
| Explanation prompt                 | Search `step__tag--explain`                                            |
| Prediction summary question labels | Search `pred-summary__q` inside the `<script>` block at the bottom     |

---

## Image layout classes

Three CSS classes control image placement inside cards:

| Class              | Effect                                    |
| ------------------ | ----------------------------------------- |
| `card-split`       | Flex row: image left, text right          |
| `card-split__img`  | Applied to the image; default width 180px |
| `card-split__body` | Applied to the text div                   |

To put the image on the right instead of the left, place the `card-split__body` div before the `card-split__img` in the HTML.

To make one image bigger than others, add an inline style override on that tag only: `style="width:260px;"`.

Below 580px, `card-split` stacks vertically automatically.

To centre a standalone image between two blocks:

```html
<img
  src="assets/satellite.png"
  alt=""
  style="display:block; margin:16px auto; width:260px; max-width:100%;"
  onerror="this.style.display='none'"
/>
```

To make any image bigger, add `style="height:Xpx; max-height:Xpx;"` on the `<img>` tag. The inline style overrides the CSS class.

---

## How to replace images

Drop the real file into `assets/` with the exact filename listed above. The page picks it up on next reload. No code change needed.

For the Pixet Basic screenshot hotspot markers, the six numbered dots sit at percentage positions over the image. If your screenshot has a different layout, search `hotspot__dot` in `index.html` and nudge the `left` and `top` percentages on each button.

---

## How interactivity works (no framework needed)

All interactivity is in `js/lesson.js` and inline `<script>` tags at the bottom of each activity HTML file.

| Feature                                           | Where                                                       |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Hero pixel animation                              | `lesson.js` — function `heroPixels()`                       |
| Flip cards (particle types)                       | `lesson.js` — `querySelectorAll('.flip')` block             |
| Pixet Basic hotspots                              | `lesson.js` — function `hotspots()`                         |
| Misconceptions tap-to-reveal                      | `lesson.js` — `querySelectorAll('.misc-item')` block        |
| Penetration diagram (click to fire each particle) | `lesson.js` — function `penCanvas()`                        |
| Exponential decay graphs (click to animate)       | `lesson.js` — function `decayGraphs()`                      |
| Nav active-state on scroll                        | `lesson.js` — function `navScroll()`                        |
| Activities dropdown (hover to open)               | CSS only, no JS                                             |
| Prediction click-to-select (activities 1 and 2)   | Inline `<script>` at bottom of each file                    |
| Drag-and-drop ranking (activity 2)                | Inline `<script>` in `activity-2.html`                      |
| Interactive radio predictions (activities 3 to 6) | Inline `<script>` at bottom of each file                    |
| Prediction summary box                            | Triggered inside each lock-in handler in each activity file |

---

## Worksheet design principles

- **No print button.** Students fill in the worksheet on screen. A prediction summary box appears automatically once all predictions are locked.
- **Capture, do not compute.** No field calculates anything for the student. All arithmetic is done by hand and typed in.
- **POE structure.** Every worksheet follows Predict, Observe, Explain. The prediction step must stay before the observation table.
- **Paper fallback.** The docx worksheets in Appendix B are the parallel paper version. If you edit questions here, update the docx too.

---

## Content provenance

Physics and detector content adapted from the MEDRA project teacher guide (C. Cabo, MediPIX/CERN, Universidade de Santiago de Compostela) and the TIMEPIX@school Student Guide (2026, CC BY-SA 4.0).
