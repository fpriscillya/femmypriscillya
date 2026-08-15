
const houseImage = document.getElementById('house');
const summerButton = document.getElementById('summer-button');
const winterButton = document.getElementById('winter-button');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('modal');
const explainButton = document.getElementById('explain-button');

const viewCount = document.getElementById('view-count');
let counter = 0;

function showSummer() {
  houseImage.src = './assets/Passive-house-summer.svg'; increaseCounter();
}

function showWinter() {
  houseImage.src = './assets/Passive-house-winter.svg';  increaseCounter();
}

function showQuestion() {
  houseImage.src = './assets/Passive-house-question.svg'; counter = 0;
  viewCount.textContent = counter;
}

function increaseCounter() {
  counter++;
  viewCount.textContent = counter;
}

summerButton.addEventListener('click', showSummer);
winterButton.addEventListener('click', showWinter);
resetButton.addEventListener('click', showQuestion);

explainButton.addEventListener('click', () => {
  modal.style.display = 'flex'; 
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});