// Simplified, in-browser re-implementation of Telio's three scoring
// dimensions, for illustration only. Telio itself scores real prompts
// sent to the Claude API and logs actual token usage; this demo runs
// entirely client-side on whatever text you type in.

const HEDGE_WORDS = [
  'maybe', 'perhaps', 'might', 'could', 'seem', 'seems', 'seemed',
  'suggest', 'suggests', 'possibly', 'likely', 'probably', 'somewhat',
  'generally', 'typically', 'arguably', 'appear', 'appears', 'roughly',
  'sort of', 'kind of', 'i think', 'i believe', 'presumably'
];

function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function analyze(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { fre: 0, ttr: 0, hwd: 0, words: 0, sentences: 0 };
  }

  const sentenceSplits = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentences = Math.max(sentenceSplits.length, 1);

  const wordsRaw = trimmed.toLowerCase().match(/[a-z']+/g) || [];
  const words = Math.max(wordsRaw.length, 1);

  const syllableCount = wordsRaw.reduce((sum, w) => sum + countSyllables(w), 0);

  const fre = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllableCount / words);

  const uniqueWords = new Set(wordsRaw);
  const ttr = uniqueWords.size / words;

  const lowerText = ' ' + trimmed.toLowerCase() + ' ';
  let hedgeHits = 0;
  HEDGE_WORDS.forEach(h => {
    const pattern = new RegExp('\\b' + h.replace(/ /g, '\\s+') + '\\b', 'g');
    const m = lowerText.match(pattern);
    if (m) hedgeHits += m.length;
  });
  const hwd = (hedgeHits / words) * 100;

  return { fre, ttr, hwd, words, sentences };
}

function formatEnergyLabel(metrics) {
  // Illustrative composite only — not calibrated to any real energy unit.
  const freNorm = Math.max(0, Math.min(1, metrics.fre / 100));
  const ttrNorm = Math.max(0, Math.min(1, metrics.ttr));
  const hwdPenalty = Math.max(0, Math.min(1, metrics.hwd / 15));

  const efficiency = (freNorm * 0.4) + (ttrNorm * 0.4) + ((1 - hwdPenalty) * 0.2);
  const relativeCost = (1 - efficiency) * 100;

  let tier = 'lean';
  if (relativeCost > 66) tier = 'costly';
  else if (relativeCost > 33) tier = 'moderate';

  return { relativeCost: relativeCost.toFixed(0), tier };
}

function initReadout() {
  const textarea = document.getElementById('telio-input');
  const freEl = document.getElementById('metric-fre');
  const ttrEl = document.getElementById('metric-ttr');
  const hwdEl = document.getElementById('metric-hwd');
  const energyEl = document.getElementById('metric-energy');
  const tierEl = document.getElementById('metric-tier');

  if (!textarea) return;

  function update() {
    const metrics = analyze(textarea.value);
    freEl.textContent = metrics.words ? metrics.fre.toFixed(1) : '—';
    ttrEl.textContent = metrics.words ? metrics.ttr.toFixed(2) : '—';
    hwdEl.textContent = metrics.words ? metrics.hwd.toFixed(1) + '%' : '—';

    if (metrics.words) {
      const e = formatEnergyLabel(metrics);
      energyEl.textContent = e.relativeCost + '%';
      tierEl.textContent = e.tier;
    } else {
      energyEl.textContent = '—';
      tierEl.textContent = 'awaiting input';
    }
  }

  textarea.addEventListener('input', update);
  update();
}

document.addEventListener('DOMContentLoaded', initReadout);
