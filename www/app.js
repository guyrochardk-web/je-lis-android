const items = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(value => ({ value, type: 'letters' })),
  ...'la le li lo lu ma me mi mo mu na ne ni no nu pa pe pi po pu ra re ri ro ru sa se si so su ta te ti to tu va ve vi vo vu da de di do du fa fe fi fo fu'.split(' ').map(value => ({ value, type: 'syllables' })),
  ...'papa maman bébé vélo moto tomate banane salade lune lune lune ami amie papi mamie'.split(' ').map(value => ({ value, type: 'words' }))
];

const STORAGE_KEY = 'jelis-progress-v1';
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
let current = null;
let lastValue = '';

const $ = id => document.getElementById(id);
const level = $('level');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  updateStats();
}
function getEligible() {
  return items.filter(item => level.value === 'all' || item.type === level.value);
}
function chooseItem() {
  const eligible = getEligible();
  if (!eligible.length) return null;
  // Une erreur augmente le poids de retour de l'élément, sans le rendre omniprésent.
  const pool = eligible.flatMap(item => {
    const p = progress[item.value] || { wrong: 0, right: 0 };
    const weight = 1 + Math.min(p.wrong * 2, 8);
    return Array(weight).fill(item);
  });
  let candidate = pool[Math.floor(Math.random() * pool.length)];
  if (eligible.length > 1 && candidate.value === lastValue) {
    const alternatives = pool.filter(item => item.value !== lastValue);
    candidate = alternatives[Math.floor(Math.random() * alternatives.length)];
  }
  return candidate;
}
function showNext() {
  current = chooseItem();
  if (!current) return;
  lastValue = current.value;
  $('prompt').textContent = current.value;
  $('itemType').textContent = ({letters:'LETTRE', syllables:'GROUPE DE LETTRES', words:'MOT'})[current.type];
  $('hint').textContent = 'Écoute sa lecture, puis choisis ✓ ou ✕.';
}
function mark(isCorrect) {
  if (!current) return;
  const p = progress[current.value] || { wrong: 0, right: 0 };
  if (isCorrect) {
    p.right++;
    $('hint').textContent = 'Bravo ! On continue.';
  } else {
    p.wrong++;
    $('hint').textContent = 'On le reverra plus souvent.';
  }
  progress[current.value] = p;
  save();
  window.setTimeout(showNext, 450);
}
function updateStats() {
  const values = Object.values(progress);
  const attempts = values.reduce((n,p) => n + p.right + p.wrong, 0);
  const rights = values.reduce((n,p) => n + p.right, 0);
  $('roundCount').textContent = `${attempts} essai${attempts > 1 ? 's' : ''}`;
  $('successRate').textContent = `${attempts ? Math.round(rights / attempts * 100) : 0} % réussis`;
  const review = Object.entries(progress)
    .filter(([,p]) => p.wrong > 0)
    .sort((a,b) => (b[1].wrong - b[1].right) - (a[1].wrong - a[1].right))
    .slice(0,12);
  $('reviewList').innerHTML = review.length
    ? review.map(([value,p]) => `<span class="review-chip">${escapeHtml(value)} · ${p.wrong} ✕</span>`).join('')
    : 'Aucun élément à revoir pour le moment.';
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
$('correct').addEventListener('click', () => mark(true));
$('wrong').addEventListener('click', () => mark(false));
$('next').addEventListener('click', showNext);
level.addEventListener('change', showNext);
$('reset').addEventListener('click', () => {
  if (confirm('Effacer tous les résultats enregistrés sur cet appareil ?')) {
    progress = {};
    save();
    $('hint').textContent = 'Les résultats ont été réinitialisés.';
    showNext();
  }
});
updateStats();
showNext();